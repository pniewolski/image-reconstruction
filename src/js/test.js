import Geometry from "./Geometry.js";
import Processing from "./Processing.js";
import Paint from "./Paint.js";
import VirtualScanner from "./VirtualScanner.js";

let bitmap = [
    [0,0,0,0,0],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [0,0,0,0,0],
];
bitmap = Geometry.multiplyResolution(bitmap, 1);
let rayres = 200;
let numOfPhotos = 200;



Paint.drawTestImage(bitmap,0,0, 60);

let deltaAngle = Math.PI / numOfPhotos;
for (let a=0; a<numOfPhotos; a++) {

}


let res = VirtualScanner.scanBitmap(bitmap, rayres, numOfPhotos);
console.log("wynik skanu",res);
Paint.drawPolarImage(res,deltaAngle, rayres, bitmap.length, 450, 0, 60);
Paint.drawTestImage(res,900,0, 1);

//let bitmap_TMP = Geometry.polarCoordsToCartesian(bitmap.length, deltaAngle, res);
//console.log(bitmap2);
//Paint.drawTestImage(bitmap_TMP, 900, 0);

let res2 = [];
res.forEach(r => {
    res2.push(Processing.calculateDFT(r));
})
console.log(res2);

Paint.drawPolarImage(res2,deltaAngle, rayres, bitmap.length, 450 ,450, 60, true)
Paint.drawTestImage(res2,900,450, 1, true);


//let bitmap2 = Geometry.polarCoordsToCartesian(bitmap.length, deltaAngle, res2);
//Paint.drawTestImage(bitmap2, 450, 450);

// let finish = Processing.calculateIDFT(bitmap2);
// Paint.drawTestImage(finish, 900, 450);

let finish = Processing.calculateIDFT(res2);
console.log(finish);
Paint.drawPolarImage(finish,deltaAngle, rayres, bitmap.length, 450 ,900, 60)
Paint.drawTestImage(finish,900,900, 1);