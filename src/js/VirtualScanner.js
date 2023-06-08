import Geometry from "./Geometry.js";
import Paint from "./Paint.js";

class VirtualScanner {
    static scanBitmap(bitmap, raysResolution, numOfPhotos, deltaAngle = null) {
        if (!deltaAngle) {
            deltaAngle = Math.PI / numOfPhotos;
        }
        let result = [];
        for (let n = 0; n < numOfPhotos; n++) {
            result.push(this.doXray(bitmap, raysResolution, n * deltaAngle));
        }
        return result;
    }

    static doXray(bitmap, raysResolution, angle) {
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

    static analyseOneRay(bitmap, bitmapSize, shift, angle) {
        let halfBitmap = bitmapSize / 2;
        let center = {
            x: halfBitmap + shift * Math.cos(angle + Math.PI/2),
            y: halfBitmap + shift * Math.sin(angle + Math.PI/2),
        };
        let rayP1 = {
            x: center.x + halfBitmap * Math.cos(angle),
            y: center.y + halfBitmap * Math.sin(angle),
        };
        let rayP2 = {
            x: center.x - halfBitmap * Math.cos(angle),
            y: center.y - halfBitmap * Math.sin(angle),
        };

        Paint.drawTestLine(rayP1, rayP2,60);

        let raysum = 0;

        for (let x = 0; x < bitmapSize; x++) {
            for (let y = 0; y < bitmapSize; y++) {
                let intersect = Geometry.lineSquareIntersect(rayP1,rayP2,{x:x, y:y});
                let weight = intersect * bitmap[x][y];
                raysum += weight;
            }
        }

        return raysum;
    }
}

export default VirtualScanner