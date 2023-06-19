class Paint {
    static createCanvas(width,height,id) {
        this.shift = 0;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
        this.canvas.setAttribute("id",id);
        this.ctx = this.canvas.getContext('2d');
        return this.ctx;
    }

    static createText(id,text) {
        const divItem = document.createElement('div');
        divItem.setAttribute("id",id);
        divItem.setAttribute("style","display:none");
        divItem.setAttribute("class","infotext");
        const newContent = document.createTextNode(text);


        document.body.appendChild(divItem);
        divItem.appendChild(newContent);
    }

    static createChooseBtn(buttonsToShow) {
        const divItem = document.createElement('div');
        divItem.id = 'choose_btns';
        divItem.setAttribute("class","infotext");

        const button1 = document.createElement('button');
        button1.id = 'method1';
        button1.textContent = '1. metoda projekcji wstecznej ';

        const button2 = document.createElement('button');
        button2.id = 'method2';
        button2.textContent = '2. metoda projekcji wstecznej z filtracją';

        const button3 = document.createElement('button');
        button3.id = 'method3';
        button3.textContent = '3. odwrotna transformata Radona i twierdzenie o rzucie Fouriera';


        document.body.appendChild(divItem);
        if (buttonsToShow.b1) divItem.appendChild(button1);
        if (buttonsToShow.b2) divItem.appendChild(button2);
        if (buttonsToShow.b3) divItem.appendChild(button3);

        return {button1,button2, button3};
    }

    static drawTestImage(ctx, bitmap, shX = 0, shY = 0, scale = 1, imaginary = false, start = false, stop=false, maxw = false) {
        let range = imaginary ? 0 : this.analyzeDataRange(bitmap);
        let scaleX = 1;
        if (maxw !== false) {
            scaleX = maxw / bitmap.length;
        }
        for (let x = 0; x < bitmap.length; x++) {
            if (start!==false && stop!==false) {
                if (x<start || x>stop) {
                    continue;
                }
            }
            for (let y = 0; y < bitmap[x].length; y++) {
                ctx.fillStyle = imaginary ? this.pickColorImag(range,bitmap[x][y]) : this.pickColor(range,bitmap[x][y]);
                ctx.fillRect(x*scaleX*scale+this.shift+shX, y*scale+this.shift+shY, scale, scale);
            }
        }
    }

    static analyzeDataRange(array) {
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

        return 'rgb('+final+','+col_re+','+col_im+')';
    }

    static drawPolarImage(ctx, array,stepAngle, rayres, bitmapSize, shX = 0, shY = 0, scale = 1, imaginary = false, fixedRange = false, start = false, stop = false) {
        let halfBitmap = bitmapSize / 2;
        let center = {
            x: halfBitmap,
            y: halfBitmap,
        };

        let range = imaginary ? 0 : this.analyzeDataRange(array, fixedRange);
        let angle = 0 - stepAngle/2 + Math.PI/2;
        for (let a = 0; a< array.length; a++) {
            if (start!==false && stop!==false) {
                if (a<start || a>stop) {
                    angle += stepAngle;
                    continue;
                }
            }
            let startAngle = angle;
            let endAngle = angle + stepAngle;

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
                ctx.moveTo(p1.x*scale+this.shift + shX,p1.y*scale+this.shift + shY);
                ctx.lineTo(p2.x*scale+this.shift + shX,p2.y*scale+this.shift + shY);
                ctx.lineTo(p3.x*scale+this.shift + shX,p3.y*scale+this.shift + shY);
                ctx.lineTo(p4.x*scale+this.shift + shX,p4.y*scale+this.shift + shY);
                ctx.lineTo(p1.x*scale+this.shift + shX,p1.y*scale+this.shift + shY);
                ctx.fill();
            }
            angle += stepAngle;
        }
    }
}

export default Paint;