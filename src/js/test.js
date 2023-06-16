import Geometry from "./Geometry.js";
import Processing from "./Processing.js";
import Paint from "./Paint.js";
import VirtualScanner from "./VirtualScanner.js";
import ImageManipulation from "./ImageManipulation.js";
import ImageUploader from "./ImageUploader.js";

import { fft, ifft } from 'mathjs';


const rayres = 256;
const numOfPhotos = 128;

const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", event => ImageUploader.handleImageUpload(event,processImageType3));

const ctx = Paint.createCanvas(1200,1200,"testImage");

function processImageType1(bitmap){
    Paint.drawTestImage(ctx, bitmap, 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end")
    let sinogram_filtered = Processing.applyRampFilter(sinogram);
    console.log("scan filtered");
//console.log("wynik skanu",res);
    Paint.drawPolarImage(ctx, sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(ctx, sinogram, 800, 0, 1);

    Paint.drawPolarImage(ctx, sinogram_filtered, deltaAngle, rayres, bitmap.length, 400, 400, 1);
    Paint.drawTestImage(ctx, sinogram_filtered, 800, 400, 1);
    console.log("start process sinogram");
    let result = ImageManipulation.processSinogram(sinogram_filtered, deltaAngle, numOfPhotos);

    console.log("end process sinogram");
    Paint.drawTestImage(ctx, result, 0, 400, 1);
}

function processImageType2(bitmap){
    Paint.drawTestImage(ctx, bitmap, 0, 0, 1);

    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end");
    Paint.drawPolarImage(ctx, sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(ctx, sinogram, 800, 0, 1);

    sinogram = ImageManipulation.shiftArray(sinogram);

    console.log("start doind 1dim dft");
    let sinogramAfterDFT = [];
    sinogram.forEach(r => {
        sinogramAfterDFT.push(fft(r));
    })

    sinogramAfterDFT = ImageManipulation.shiftArray(sinogramAfterDFT);

    let sinoTraced = Geometry.polarCoordsToCartesian(rayres,deltaAngle,sinogramAfterDFT);
    sinoTraced = ImageManipulation.shiftArray(sinoTraced);
    Paint.drawTestImage(ctx, sinoTraced,0,400, 1, true);
    Paint.drawPolarImage(ctx, sinogramAfterDFT,deltaAngle, rayres, bitmap.length, 400 ,400, 1, true)
    Paint.drawTestImage(ctx, sinogramAfterDFT,800,400, 1, true);

    console.log("start doing 2dim idft");
    let finish = Processing.ifftReal(sinoTraced);
    finish = ImageManipulation.shiftArray(finish);
    Paint.drawTestImage(ctx, finish,0,800, 1, false);


}

function processImageType3(bitmap){

    Paint.drawTestImage(ctx, Processing.transposeArray(bitmap), 0, 0, 1);


    let deltaAngle = Math.PI / numOfPhotos;
    console.log("scan start")
    let sinogram = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos, null, true);
    console.log("scan end")
    let sinogram_filtered = Processing.applyRampFilter(sinogram);
    console.log("scan filtered");
    Paint.drawPolarImage(ctx, sinogram, deltaAngle, rayres, bitmap.length, 400, 0, 1);
    Paint.drawTestImage(ctx, sinogram, 800, 0, 1);
    console.log("start process sinogram");
    let result = ImageManipulation.processSinogram(sinogram_filtered, deltaAngle, numOfPhotos);
    console.log("end process sinogram");
    Paint.drawTestImage(ctx, result, 0, 400, 1);

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
    Paint.drawTestImage(ctx, finish,400,400, 1, false);

}