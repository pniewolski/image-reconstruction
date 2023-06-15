import Geometry from "./Geometry.js";
import Paint from "./Paint.js";
import ImageManipulation from "./ImageManipulation.js";

class VirtualScanner {
    static scanBitmap(bitmap, raysResolution, numOfPhotos, deltaAngle = null, quickMode = false) {
        if (!deltaAngle) {
            deltaAngle = Math.PI / numOfPhotos;
        }
        let result = [];
        for (let n = 0; n < numOfPhotos; n++) {
            result.push(this.doXray(bitmap, raysResolution, n * deltaAngle, quickMode));
        }
        return result;
    }

    static doXray2(bitmap, raysResolution, angle, quickMode) {
        let xrayResult = [];
        let bitmapSize = Math.min(bitmap.length, bitmap[0].length);
        let rayDist = bitmapSize / (raysResolution);
        for (let n = 0; n < raysResolution; n++) {
            let multiplier = n - raysResolution/2;
            let shift = multiplier * rayDist + rayDist/2;
            xrayResult.push(this.analyseOneRay(bitmap, bitmapSize, shift, angle));
        }
        return xrayResult;
    }

    static doXray(bitmap, raysResolution, angle, quickMode=false) {
        let xrayResult = [];
        let rotatedBitmap = ImageManipulation.rotateAndSmoothImage(bitmap,angle);
        let rayDist = bitmap.length / raysResolution;
        for (let n = 0; n < raysResolution; n++) {
            let x = Math.round(n*rayDist);
            let sum = 0;
            for (let y=0; y<bitmap.length; y++) {
                sum += rotatedBitmap[x][y];
            }
            xrayResult.push(sum);
        }
        return xrayResult;
    }

    static analyseOneRay(bitmap, bitmapSize, shift, angle) {
        let halfBitmap = bitmapSize / 2;
        let center = {
            x: halfBitmap + shift * Math.cos(angle + Math.PI / 2),
            y: halfBitmap + shift * Math.sin(angle + Math.PI / 2),
        };
        let rayP1 = {
            x: center.x + halfBitmap * Math.cos(angle),
            y: center.y + halfBitmap * Math.sin(angle),
        };
        let rayP2 = {
            x: center.x - halfBitmap * Math.cos(angle),
            y: center.y - halfBitmap * Math.sin(angle),
        };

        //Paint.drawTestLine(rayP1, rayP2);

        let raysum = 0;

        let line = Geometry.lineFrom2Points(rayP1, rayP2);
        for (let x = 0; x < bitmapSize; x++) {
            for (let y = 0; y < bitmapSize; y++) {
                let intersect = Geometry.lineSquareIntersect(rayP1, rayP2, {x: x, y: y});
                let weight = intersect * bitmap[x][y];
                raysum += weight;
            }
        }

        return raysum // bitmapSize;
    }

    static bitmapToPole(bitmap, raysResolution, numOfPhotos, deltaAngle = null, quickMode = false) {
        if (!deltaAngle) {
            deltaAngle = Math.PI / numOfPhotos;
        }
        let result = [];
        for (let n = 0; n < numOfPhotos; n++) {
            result.push(this.doLine(bitmap, raysResolution, n * deltaAngle, quickMode));
        }
        return result;
    }

    static doLine(bitmap, raysResolution, angle, quickMode=false) {
        let xrayResult = [];
        let center = Math.floor(bitmap[0].length/2);
        let rotatedBitmap = ImageManipulation.rotateAndSmoothImage(bitmap,angle);
        let rayDist = bitmap.length / raysResolution;
        for (let n = 0; n < raysResolution; n++) {
            let x = Math.round(n*rayDist);
            let sum = rotatedBitmap[x][center];
            xrayResult.push(sum);
        }
        return xrayResult;
    }
}

export default VirtualScanner