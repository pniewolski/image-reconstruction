import Paint from "./Paint.js";

class Geometry {


    static lineSquareIntersect(l1, l2, sq1) {
        let p1 = {x: sq1.x, y: sq1.y};
        let p2 = {x: sq1.x+1, y: sq1.y};
        let p3 = {x: sq1.x+1, y: sq1.y+1};
        let p4 = {x: sq1.x, y: sq1.y+1};

        let i1 = this.lineIntersect(l1, l2, p1, p2);
        let i2 = this.lineIntersect(l1, l2, p2, p3);
        let i3 = this.lineIntersect(l1, l2, p3, p4);
        let i4 = this.lineIntersect(l1, l2, p4, p1);

        let points = [];
        if (i1) points.push(i1);
        if (i2) points.push(i2);
        if (i3) points.push(i3);
        if (i4) points.push(i4);

        if (points.length == 4) console.log("4!!!")
/*
        if (points.length == 3) {
            if (points[2].x != points[1].x || points[2].y != points[1].y) {
                console.log("biore",points[2],points[1])
                return this.distanceTwoPoints(points[2], points[1]);
            } else if (points[2].x != points[0].x || points[2].y != points[0].y) {
                console.log("biore",points[2],points[0])
                return this.distanceTwoPoints(points[2], points[0]);
            } else if (points[1].x != points[0].x || points[1].y != points[0].y) {
                console.log("biore",points[1],points[0])
                return this.distanceTwoPoints(points[1], points[0]);
            }
        }

 */
        if (points.length != 2) return 0;
        return this.distanceTwoPoints(points[0], points[1]);
    }

    static distanceTwoPoints(t, p) {
        return Math.sqrt((t.x - p.x) ** 2 + (t.y - p.y) ** 2);
    }

    static lineIntersect(p1, p2, p3, p4) {
        if ((p1.x === p2.x && p1.y === p2.y) || (p3.x === p4.x && p3.y === p4.y)) {
            return false;
        }
        let denominator = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y))
        if (denominator === 0) {
            return false;
        }
        let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator
        let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }
        let x = p1.x + ua * (p2.x - p1.x)
        let y = p1.y + ua * (p2.y - p1.y)
        return { x: x, y: y }
    }

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

    static multiplyResolution(input, mul) {
        let result = [];
        for (let x = 0; x<input.length; x++) {
            let subresult = [];
            for (let y=0; y<input[x].length; y++) {
                for (let a = 0; a< mul; a++) {
                    subresult.push(input[x][y]);
                }
            }
            for (let a = 0; a< mul; a++) {
                result.push(subresult);
            }
        }
        return result;
    }

}

export default Geometry;
