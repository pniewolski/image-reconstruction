import AnimationHelper from "./AnimationHelper.js";
import ImageUploader from "./ImageUploader.js";
import Paint from "./Paint.js";
import Animations from "./Animations.js";
import VirtualScanner from "./VirtualScanner.js";
import ImageManipulation from "./ImageManipulation.js";
import Processing from "./Processing.js";
import {fft} from "mathjs";
import Geometry from "./Geometry.js";

const rayres = 512;
const numOfPhotos = 128;
const deltaAngle = Math.PI / numOfPhotos;

var images = [];

var sharedResults = {
    deltaAngle: deltaAngle,
    rayres: rayres,
    numOfPhotos: numOfPhotos,
};

prepareData();

function prepareData() {
    loadImages([
        "/img/ct_bg.png",
        "/img/ct_ring.png",
    ])
        .then((images) => {
            console.log('Wszystkie obrazy zostały załadowane:', images);
            prepareGui();
        })
        .catch((error) => {
            console.error('Wystąpił błąd podczas ładowania obrazów:', error);
        });
}

function loadImages(urls) {
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = url;
        });
    };

    let promiseChain = Promise.resolve();

    urls.forEach((url) => {
        promiseChain = promiseChain.then(() => {
            return loadImage(url).then((image) => {
                images.push(image);
            });
        });
    });

    return promiseChain.then(() => {
        return images;
    });
}

function prepareGui() {
    console.log("przygotowanie gui");
    const imageInput = document.getElementById("imageInput");
    imageInput.addEventListener("change", event => ImageUploader.handleImageUpload(event, rayres, step1doCT));
}

function makeSinogram() {
    console.log("pozyskanie sinogramu")
    sharedResults.sinogram = VirtualScanner.scanBitmap(sharedResults.bitmap, rayres, numOfPhotos, null, true);
    sharedResults.transBitmap = Processing.transposeArray(sharedResults.bitmap);
}

function showText(id) {
    document.getElementById(id).setAttribute("style","display:default");
}

function hideText(id) {
    document.getElementById(id).setAttribute("style","display:none");
}

function showButtons() {
    const buttons = Paint.createChooseBtn();
    buttons.button1.addEventListener("click",step2Method1);
    buttons.button2.addEventListener("click",step3Method2);
    buttons.button3.addEventListener("click",step4Method3);

}

function step1doCT(bitmap) {
    console.log("animacja skanowania");
    document.getElementById("imageInput").remove();
    sharedResults.bitmap = bitmap;
    Paint.createText("txt_please_wait","Proszę czekać... Ładuję obrazek i przygotowuję tomograf do działania. Aplikacja ma trochę do obliczania, więc jeśli masz wolny komputer to możesz potrzebować nieco cierpliwości.");
    Paint.createText("txt_scanning","Trwa skanowanie. Tomograf oświetla obiekt pod wszystkimi kątami. Obok widzisz pozyskane dane przedstawione na dwa sposoby. Obrazek taki nazywamy sinogramem.");
    const ctx = Paint.createCanvas(1820,700,"scanningAnim");
    Paint.createText("txt_scanning_finished","Skanowanie zostało ukończone. Wybierz teraz jedną z metod rekonstrukcji obrazu.");


    let anim1 = new AnimationHelper();
    const numberOfFrames = 8;
    const animLength = 1000;
    const frameDelay = Math.round(animLength/numberOfFrames);
    const photosPerIteration = Math.ceil(numOfPhotos/numberOfFrames);

    anim1.addTask(showText, 10, "txt_please_wait");
    anim1.addTask(makeSinogram, 1500);
    anim1.addTask(hideText, 10, "txt_please_wait");
    anim1.addTask(showText, 500, "txt_scanning");
    anim1.addTaskLoop(Animations.CTscan,frameDelay, numberOfFrames, ctx, sharedResults, photosPerIteration, images);
    anim1.addTask(showText, 10, "txt_scanning_finished");
    anim1.addTask(showButtons, 10);
    anim1.start();
}

function step2Method1() {
    console.log("wybrano metodę 1");
    document.getElementById("choose_btns").remove();

    Paint.createText("txt_met1_intro","Wybrałeś metodę wstecznej projekcji. Jest to metoda bardzo prosta, ale generuje obraz o kiepskiej jakości. Polega po prostu na nakładaniu na siebie kolejnych wartstw sinogramu. Na poniższej animacji widzisz stopniowe nakładanie się wartstw.");
    const ctx = Paint.createCanvas(1820,512,"met1Anim");
    Paint.createText("txt_met1_outro","Jak widzisz obraz jest dość niewyraźny. Sprawdź zatem metodę wstecznej projekcji z filtracją.");

    const numberOfFrames = 32;
    const animLength = 5000;
    const frameDelay = Math.round(animLength/numberOfFrames);
    const photosPerIteration = Math.ceil(sharedResults.numOfPhotos/numberOfFrames);

    let anim2 = new AnimationHelper();
    anim2.addTask(showText, 1000, "txt_met1_intro");
    anim2.addTaskLoop(Animations.sumIter,frameDelay, numberOfFrames, ctx, sharedResults, photosPerIteration);
    anim2.addTask(showText, 10, "txt_met1_outro");
    anim2.addTask(showButtons, 10);
    anim2.start();
}

function prepareRampSinogram() {
    sharedResults.filteredSinogram = Processing.applyRampFilter(sharedResults.sinogram);
}

function drawStaticSinogram(ctx, sharedResults) {
    Paint.drawTestImage(ctx, sharedResults.sinogram, 1300, 0, 1, );
}

function step3Method2() {
    console.log("wybrano metodę 2");
    document.getElementById("choose_btns").remove()

    Paint.createText("txt_met2_preintro","Proszę czekać.. Przygotowuję dane...");
    Paint.createText("txt_met2_intro","Wybrałeś metodę wstecznej projekcji z filtracją. jak sama nazwa wskazuje działa on tak samo jak metoda wstecznej projekcji, lecz każdy rzut sinogramu jest przefiltrowany przez filtr rampowy. Poniżej widzisz przepuszczanie sinogramu przez filtr.");
    Paint.createText("txt_met2_intro2","Sinogram został przefiltrowany, czas na nałożenie na siebie kolejnych wartstw.");
    const ctx = Paint.createCanvas(1820,512,"met2Anim");
    Paint.createText("txt_met2_outro","Oto gotowy obrazek stworzony metodą wstecznej projekcji z filtracją.");

    const AnumberOfFrames = 32;
    const AanimLength = 5000;
    const AframeDelay = Math.round(AanimLength/AnumberOfFrames);
    const AphotosPerIteration = Math.ceil(sharedResults.numOfPhotos/AnumberOfFrames);

    const BnumberOfFrames = 64;
    const BanimLength = 3000;
    const BframeDelay = Math.round(BanimLength/BnumberOfFrames);
    const BphotosPerIteration = Math.ceil(sharedResults.numOfPhotos/BnumberOfFrames);

    let anim2 = new AnimationHelper();
    anim2.addTask(showText, 10, "txt_met2_preintro");
    anim2.addTask(prepareRampSinogram, 100);
    anim2.addTask(hideText, 10, "txt_met2_preintro");
    anim2.addTask(showText, 10, "txt_met2_intro");
    anim2.addTask(drawStaticSinogram, 2000, ctx, sharedResults);
    anim2.addTaskLoop(Animations.filteringSinogram,AframeDelay, AnumberOfFrames, ctx, sharedResults, AphotosPerIteration);
    anim2.addTask(showText, 100, "txt_met2_intro2");
    anim2.addTaskLoop(Animations.sumIter,BframeDelay, BnumberOfFrames, ctx, sharedResults, BphotosPerIteration, true);
    anim2.addTask(showText, 10, "txt_met2_outro");
    anim2.addTask(showButtons, 10);
    anim2.start();
}

function doFFtSinigram() {
    const sinogramShft = ImageManipulation.shiftArray(sharedResults.sinogram);
    let sinogramAfterDFT = [];
    sinogramShft.forEach(r => {
        sinogramAfterDFT.push(fft(r));
    })
    sinogramAfterDFT = ImageManipulation.shiftArray(sinogramAfterDFT);
    sharedResults.sinogramAfterDFT = sinogramAfterDFT;
}

function drawStaticSinograms(ctx, sharedResults) {
    Paint.drawPolarImage(ctx, sharedResults.sinogram, sharedResults.deltaAngle, sharedResults.rayres, sharedResults.bitmap.length, 750, 0, 1);
    Paint.drawTestImage(ctx, sharedResults.sinogram, 1300, 0, 1, );
}

function doFinalCalculations1(ctx) {
    let sinoTraced = Geometry.polarCoordsToCartesian(sharedResults.rayres,sharedResults.deltaAngle,sharedResults.sinogramAfterDFT);
    sinoTraced = ImageManipulation.shiftArray(sinoTraced);
    sharedResults.sinogramCartesian = sinoTraced;
}

function doFinalCalculations2(ctx) {
    let finish = Processing.ifftReal(sharedResults.sinogramCartesian);
    finish = ImageManipulation.shiftArray(finish);
    finish = ImageManipulation.cutoffEdges(finish);
    Paint.drawTestImage(ctx, finish,0,0, 1);
}

function step4Method3() {
    console.log("wybrano metodę 3");
    document.getElementById("choose_btns").remove();

    Paint.createText("txt_met3_preintro","Proszę czekać.. Przygotowuję dane...");
    Paint.createText("txt_met3_intro","Metoda którą wybrałeś wymaga przeprowadzenia transformacji Fouriera na każdym rzucie sinogramu.");
    Paint.createText("txt_met3_mid","Kolejnym krokiem jest wykonanie odwrotnej dwuwymiarowej transformacji Fouriera na otrzymanym zbiorze danych. Na tym okrągłym, czyli w ukłądzie biegunowym.");
    Paint.createText("txt_met3_mid2","Obrazek został przekonwertowany na zmienne kartezjańskie, rozpoczynam transformację Fouriera.");
    const ctx = Paint.createCanvas(1820,512,"met3Anim");
    Paint.createText("txt_met3_end","Obrazek, który widzisz jest wynikiem przeprowadzenia transformacji na obrazku znajdującym się obok niego");

    const numberOfFrames = 32;
    const animLength = 5000;
    const frameDelay = Math.round(animLength/numberOfFrames);
    const photosPerIteration = Math.ceil(sharedResults.numOfPhotos/numberOfFrames);

    let anim3 = new AnimationHelper();
    anim3.addTask(showText, 10, "txt_met3_preintro");
    anim3.addTask(doFFtSinigram, 10);
    anim3.addTask(showText, 10, "txt_met3_intro");
    anim3.addTask(drawStaticSinograms, 2000, ctx, sharedResults);
    anim3.addTaskLoop(Animations.fftSinogram, frameDelay, numberOfFrames, ctx, sharedResults, photosPerIteration);
    anim3.addTask(showText, 10, "txt_met3_mid");
    anim3.addTask(doFinalCalculations1, 300, ctx);
    anim3.addTask(showText, 10, "txt_met3_mid2");
    anim3.addTask(doFinalCalculations2, 300, ctx);
    anim3.addTask(showText, 10, "txt_met3_end");
    anim3.addTask(showButtons, 10);
    anim3.start();
}



/*
anim1.addTask(noLooper,1000,"a",99,3232,"C");
anim1.addTask(noLooper,2000,"A",99,11,"C");
anim1.addTask(noLooper,1000,"AA",99,3232,"C");
anim1.addTask(noLooper,2000,"AAAAa",99,11,"C");
anim1.addTaskLoop(looper,500,10, "par1","par2");
anim1.addTask(noLooper,4000,"a",99,3232,"C");

anim1.start();*/
