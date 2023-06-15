class Paint {
    static initContext() {
        this.shift = 0;
        //this.canvSize = 1200;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1200;
        this.canvas.height = 1600;
        document.body.appendChild(this.canvas);
        this.canvas.setAttribute("id","picture");
        this.ctx = this.canvas.getContext('2d');

        return this.ctx;
    }
    static getInstanceCtx() {
        if (this.ctx) {
            return this.ctx;
        } else {
            return this.initContext();
        }
    }

    static drawTestLine(l1,l2,scale) {
        let ctx = this.getInstanceCtx();
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 0.7;

        ctx.beginPath();
        ctx.moveTo(l1.x*scale + this.shift, l1.y*scale + this.shift);
        ctx.lineTo(l2.x*scale + this.shift, l2.y*scale + this.shift);
        ctx.stroke();
    }

    static drawTestImage(bitmap, shX = 0, shY = 0, scale = 1, imaginary = false, fixedRange = false) {
        let ctx = this.getInstanceCtx();
        let range = imaginary ? 0 : this.analyzeDataRange(bitmap, fixedRange);
        for (let x = 0; x < bitmap.length; x++) {
            for (let y = 0; y < bitmap[x].length; y++) {
                //ctx.fillStyle = "rgb("+(255-bitmap[x][y]*115)+","+(255-bitmap[x][y]*115)+","+(255-bitmap[x][y]*115)+")";
                ctx.fillStyle = imaginary ? this.pickColorImag(range,bitmap[x][y]) : this.pickColor(range,bitmap[x][y]);
                ctx.fillRect(x*scale+this.shift+shX, y*scale+this.shift+shY, scale, scale);
            }
        }
    }

    static analyzeDataRange(array, fixedRange) {
        if (fixedRange) {
            return {
                min: 0,
                max: 25,
                mul: 10,
            }
        }
        let min = array[0][0];
        let max = array[0][0];
        for (let x=0; x<array.length; x++) {
            for (let y=0; y<array[x].length; y++) {
                if (array[x][y] < min) min = array[x][y];
                if (array[x][y] > max) max = array[x][y];
            }
        }
        let result = {
            min,
            max,
            mul: 255/Math.abs(min-max),
        }
        return result;
    }

    static pickColor(range,value) {
        let final = (value-range.min)*range.mul;
        if (final < 0) final = 0;
        if (final > 255) final = 255;
        return 'rgb('+final+','+final+','+final+')';
    }

    static pickColorImag(range,value) {
        let mod = Math.sqrt(value.re**2 + value.im**2);
        let final = mod * 3;
        if (final < 0) final = 0;
        if (final > 255) final = 255;


        let col_re = (value.re+20)*4;
        if (col_re < 0) col_re = 0;
        if (col_re > 255) col_re = 255;

        let col_im = (value.im+20)*4;
        if (col_im < 0) col_im = 0;
        if (col_im > 255) col_im = 255;

        // /console.log(value.real, final);
        return 'rgb('+final+','+col_re+','+col_im+')';
    }

    static drawPolarImage(array,stepAngle, rayres, bitmapSize, shX = 0, shY = 0, scale = 1, imaginary = false, fixedRange = false) {
        let ctx = this.getInstanceCtx();
        let halfBitmap = bitmapSize / 2;
        let center = {
            x: halfBitmap,
            y: halfBitmap,
        };
        let range = imaginary ? 0 : this.analyzeDataRange(array, fixedRange);
        let angle = 0 - stepAngle/2 + Math.PI/2;
        for (let a = 0; a< array.length; a++) {
            let startAngle = angle;
            let endAngle = angle + stepAngle;

            //console.log("angle",startAngle/Math.PI*180);

            for (let b=0; b<array[a].length; b++) {
                let distA = (bitmapSize/rayres)*(b+0.5-rayres/2) + (bitmapSize/rayres)/2;
                let distB = (bitmapSize/rayres)*(b+0.5-rayres/2) - (bitmapSize/rayres)/2;

                let p1 = {
                    x: center.x + distA * Math.cos(startAngle),
                    y: center.x + distA * Math.sin(startAngle),
                }
                let p2 = {
                    x: center.x + distA * Math.cos(endAngle),
                    y: center.x + distA * Math.sin(endAngle),
                }
                let p3 = {
                    x: center.x + distB * Math.cos(endAngle),
                    y: center.x + distB * Math.sin(endAngle),
                }
                let p4 = {
                    x: center.x + distB * Math.cos(startAngle),
                    y: center.x + distB * Math.sin(startAngle),
                }

                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.lineWidth = 0.0;

                ctx.fillStyle = imaginary ? this.pickColorImag(range,array[a][b]) : this.pickColor(range,array[a][b]);
                ctx.beginPath();
                //ctx.arc(center.x*100+500, center.y*100+500, distA*100, startAngle, endAngle);
                //ctx.lineTo(p3.x*100+500,p3.y*100+500);
                //ctx.arc(center.x*100+500, center.y*100+500, distB*100, endAngle, startAngle);
                ctx.moveTo(p1.x*scale+this.shift + shX,p1.y*scale+this.shift + shY);
                ctx.lineTo(p2.x*scale+this.shift + shX,p2.y*scale+this.shift + shY);
                ctx.lineTo(p3.x*scale+this.shift + shX,p3.y*scale+this.shift + shY);
                ctx.lineTo(p4.x*scale+this.shift + shX,p4.y*scale+this.shift + shY);
                ctx.lineTo(p1.x*scale+this.shift + shX,p1.y*scale+this.shift + shY);
                ctx.fill();
                //ctx.stroke();


            }
            angle += stepAngle;
        }
    }
}

export default Paint;