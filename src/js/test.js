import Geometry from "./Geometry.js";
import Processing from "./Processing.js";
import Paint from "./Paint.js";
import VirtualScanner from "./VirtualScanner.js";
import ImageManipulation from "./ImageManipulation.js";
import ImageUploader from "./ImageUploader.js";

import { fft, ifft } from 'mathjs';


const rayres = 256;
const numOfPhotos = 256;

const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", event => ImageUploader.handleImageUpload(event,processImageType3));

const input1D = [1, 2, 3, 4, 5,4,3,2];
const output1D = ifft(fft(input1D));

console.log(output1D);





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

    sinogram = ImageManipulation.shiftArray(sinogram);

    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(fft(r));
    })

    sinogramAfterDFT = ImageManipulation.shiftArray(sinogramAfterDFT);

    let sinoTraced = Geometry.polarCoordsToCartesian(rayres,deltaAngle,sinogramAfterDFT);
    sinoTraced = ImageManipulation.shiftArray(sinoTraced);
    Paint.drawTestImage(sinoTraced,0,400, 1, true);
    Paint.drawPolarImage(sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,400, 1, true)
    Paint.drawTestImage(sinogramAfterDFT,800,400, 1, true);

    console.log("start doing 2dim idft");
    let finish = Processing.ifftReal(sinoTraced);
    finish = ImageManipulation.shiftArray(finish);
    Paint.drawTestImage(finish,0,800, 1, false);


}

function processImageType3(bitmap){

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
    console.log("start process sinogram");
    let result = ImageManipulation.processSinogram(sinogram_filtered, deltaAngle, numOfPhotos);
    console.log("end process sinogram");
    Paint.drawTestImage(result, 0, 400, 1);


    sinogram = ImageManipulation.shiftArray(sinogram);

    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(fft(r));
    })

    sinogramAfterDFT = ImageManipulation.shiftArray(sinogramAfterDFT);

    let sinoTraced = Geometry.polarCoordsToCartesian(rayres,deltaAngle,sinogramAfterDFT);
    sinoTraced = ImageManipulation.shiftArray(sinoTraced);

    console.log("start doing 2dim idft");
    let finish = Processing.ifftReal(sinoTraced);
    finish = ImageManipulation.shiftArray(finish);
    finish = ImageManipulation.cutoffEdges(finish);
    Paint.drawTestImage(finish,400,400, 1, false);

}

function processImageType2b(bitmap){

    Paint.drawTestImage(bitmap, 0, 0, 1);

    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    sinogram = ImageManipulation.shiftArray(sinogram);
    Paint.drawPolarImage(sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(sinogram, 800, 0, 1);
    console.log("1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(fft(r));
    })
    sinogramAfterDFT = ImageManipulation.shiftArray(sinogramAfterDFT);
    // 1 linia - oryginał, sinogram polar, sinogram x,y


    Paint.drawPolarImage(sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,400, 1, true)
    Paint.drawTestImage(sinogramAfterDFT,800,400, 1, true);
    console.log("coords");
    let sinoTraced = Geometry.polarCoordsToCartesian(rayres,deltaAngle,sinogramAfterDFT);
    //sinoTraced = ImageManipulation.cutoffEdgesComplex(sinoTraced);
    //sinoTraced = ImageManipulation.flipArray(sinoTraced);
    sinoTraced = ImageManipulation.shiftArray(sinoTraced);
    Paint.drawTestImage(sinoTraced,0,400, 1, true);
    //console.log("sinoTraced",sinoTraced);
    // 2 linia - sinogran po fft: polar przekonwertowany, polar, xy

    console.log("ifft");
    let finish = Processing.ifftReal(sinoTraced);
    finish = ImageManipulation.shiftArray(finish);
    Paint.drawTestImage(finish,400,800, 1, false);


    console.log("fft");
    let perfect = fft(bitmap);
    perfect = ImageManipulation.shiftArray(perfect);
    perfect = ImageManipulation.cutoffEdgesComplex(perfect);
    perfect = ImageManipulation.shiftArray(perfect);
    Paint.drawTestImage(perfect,0,800, 1, true);
    //console.log("perfect",perfect);

    //3 linia - oryginalny obrazek po 2wym fft, sinogram po fft i po ifft polar i xy

    console.log("ifft");
    let finish2 = Processing.ifftReal(perfect);
    Paint.drawTestImage(finish2,800,800, 1, false);

    console.log("diff");
    let diff = ImageManipulation.arrayDiffComplex(sinoTraced,perfect);
    Paint.drawTestImage(diff,0,1200, 1,  true);
    console.log(diff);

}