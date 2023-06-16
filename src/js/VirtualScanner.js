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