import Paint from "./Paint.js";

class Geometry {

    static polarCoordsToCartesian(cartesianDimension,deltaAngle, data) {
        let centerXy = cartesianDimension/2;
        let result = [];
        for (let x=0 ; x<cartesianDimension ; x++) {
            result[x] = [];
            for (let y=0; y<cartesianDimension; y++) {
                result [x][y] = this.findClosestPixel(cartesianDimension, x, y, deltaAngle, data);
            }
        }
        return result;
    }

    static findClosestPixel(cartesianDimension, x, y, deltaAngle, data) {
        let halfBitmap = cartesianDimension/2;
        x = x-halfBitmap;
        y = y-halfBitmap;
        let real_angle = Math.atan2(y, x);

        let bestAngle = 0;
        let bestSample = 0;
        let bestValue = 999999;

        //find best angle
        for (let d = 0; d<data.length; d++) {
            let angle = d*deltaAngle - Math.PI/2;
            let angle2 = angle + Math.PI;
            let value = (Math.abs(real_angle - angle))%(Math.PI*2);
            let value2 = (Math.abs(real_angle - angle2))%(Math.PI*2);

            if (value<bestValue || value2<bestValue) {
                bestAngle = angle;
                bestValue = value;
                bestSample = d;
            }

            if (value2<bestValue) {
                bestAngle = angle;
                bestValue = value2;
                bestSample = d;
            }
        }

        let dataLength = data[bestSample].length;

        let p = {
            x: Math.cos(bestAngle) * halfBitmap,
            y: Math.sin(bestAngle) * halfBitmap,
        }

        let step = {
            x: 2*p.x / dataLength,
            y: 2*p.y / dataLength,
        }

        let mindist = 99999;
        let bestPoint = 0;

        for (let d = 0; d< dataLength; d++) {
            let currentPixel = {
                x: p.x - step.x * d,
                y: p.y - step.y * d,
            }
            let distance = Math.hypot(currentPixel.x - x, currentPixel.y - y);
            if (distance < mindist) {
                mindist = distance;
                bestPoint = d;
            }
        }

        return data[bestSample][bestPoint];
    }

}

export default Geometry;
