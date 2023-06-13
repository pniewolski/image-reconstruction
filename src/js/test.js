import Geometry from "./Geometry.js";
import Processing from "./Processing.js";
import Paint from "./Paint.js";
import VirtualScanner from "./VirtualScanner.js";
import ImageManipulation from "./ImageManipulation.js";
import ImageUploader from "./ImageUploader.js";
const rayres = 250;
const numOfPhotos = 250;

const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", event => ImageUploader.handleImageUpload(event,processImageType3));

function processImageType1(bitmap){
    Paint.drawTestImage(bitmap, 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end")
    let sinogram_filtered = Processing.applyRampFilter(sinogram);
    console.log("scan filtered");
//console.log("wynik skanu",res);
    Paint.drawPolarImage(sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(sinogram, 800, 0, 1);

    Paint.drawPolarImage(sinogram_filtered, deltaAngle, rayres, bitmap.length, 400, 400, 1);
    Paint.drawTestImage(sinogram_filtered, 800, 400, 1);
    console.log("start process sinogram");
    let result = ImageManipulation.processSinogram(sinogram_filtered, deltaAngle, numOfPhotos);
    console.log("end process sinogram");
    Paint.drawTestImage(result, 0, 400, 1);
}

function processImageType2(bitmap){
    Paint.drawTestImage(bitmap, 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end");
    Paint.drawPolarImage(sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(sinogram, 800, 0, 1);
    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(Processing.calculateDFT(r));
    })
    console.log("paint");
    Paint.drawPolarImage(sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,400, 1, true)
    Paint.drawTestImage(sinogramAfterDFT,800,400, 1, true);
    console.log("start doing 2dim idft");
    let finish = Processing.calculateIDFT_2d(sinogramAfterDFT);
    console.log("end 2dim dft");
    Paint.drawPolarImage(finish,deltaAngle, rayres, bitmap.length, 400 ,800, 1, false)
    Paint.drawTestImage(finish,800,800, 1, false);


}

function processImageType3(bitmap){
    Paint.drawTestImage(bitmap, 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogramOrigin = VirtualScanner.bitmapToPole(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end");
    Paint.drawPolarImage(sinogramOrigin, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(sinogramOrigin, 800, 0, 1);
    console.log("calculateDFT_2d");
    let finish = Processing.calculateDFT_2d(sinogramOrigin);
    console.log("end 2dim dft");
    Paint.drawPolarImage(finish,deltaAngle, rayres, bitmap.length, 400 ,300, 1, true)
    Paint.drawTestImage(finish,800,300, 1, true);


    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end");
    Paint.drawPolarImage(sinogram, deltaAngle, rayres, bitmap.length, 400, 600, 1);
    Paint.drawTestImage(sinogram, 800, 600, 1);
    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(Processing.calculateDFT(r));
    })
    console.log("paint");
    Paint.drawPolarImage(sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,900, 1, true)
    Paint.drawTestImage(sinogramAfterDFT,800,900, 1, true);

}

function processImageType4(bitmap){
    Paint.drawTestImage(bitmap, 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end");
    Paint.drawPolarImage(sinogram, deltaAngle, rayres, bitmap.length, 400, 600, 1);
    Paint.drawTestImage(sinogram, 800, 600, 1);
    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(Processing.calculateDFT(r));
    })
    console.log("paint");
    Paint.drawPolarImage(sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,900, 1, true)
    Paint.drawTestImage(sinogramAfterDFT,800,900, 1, true);

}

//let bitmap_TMP = Geometry.polarCoordsToCartesian(bitmap.length, deltaAngle, res);
//console.log(bitmap2);
//Paint.drawTestImage(bitmap_TMP, 900, 0);

/*let res2 = [];
res.forEach(r => {
    res2.push(Processing.calculateDFT(r));
})
console.log(res2);

Paint.drawPolarImage(res2,deltaAngle, rayres, bitmap.length, 400 ,400, 1, true)
Paint.drawTestImage(res2,800,400, 1, true);


//let bitmap2 = Geometry.polarCoordsToCartesian(bitmap.length, deltaAngle, res2);
//Paint.drawTestImage(bitmap2, 450, 450);

// let finish = Processing.calculateIDFT(bitmap2);
// Paint.drawTestImage(finish, 900, 450);

let finish = Processing.calculateIDFT(res2);
console.log(finish);
Paint.drawPolarImage(finish,deltaAngle, rayres, bitmap.length, 400 ,800, 1)
Paint.drawTestImage(finish,800,800, 1);*/

