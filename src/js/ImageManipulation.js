class ImageManipulation {
        static rotateAndSmoothImage(image, radians) {

            // Pobierz wymiary obrazu
            const width = image[0].length;
            const height = image.length;

            // Oblicz środek obrazu
            const centerX = Math.floor(width / 2);
            const centerY = Math.floor(height / 2);

            // Utwórz nową macierz dla obróconego obrazu
            const rotatedImage = [];

            // Iteruj po pikselach w nowej macierzy
            for (let y = 0; y < height; y++) {
                rotatedImage[y] = [];
                for (let x = 0; x < width; x++) {
                    // Oblicz współrzędne piksela w oryginalnym obrazie
                    const xOffset = x - centerX;
                    const yOffset = y - centerY;

                    // Oblicz nowe współrzędne piksela po obróceniu
                    const rotatedX =
                        Math.round(xOffset * Math.cos(radians) - yOffset * Math.sin(radians)) +
                        centerX;
                    const rotatedY =
                        Math.round(xOffset * Math.sin(radians) + yOffset * Math.cos(radians)) +
                        centerY;

                    // Sprawdź, czy nowe współrzędne są w granicach obrazu
                    if (
                        rotatedX >= 0 &&
                        rotatedX < width &&
                        rotatedY >= 0 &&
                        rotatedY < height
                    ) {
                        // Przypisz wartość piksela z oryginalnego obrazu
                        rotatedImage[y][x] = image[rotatedY][rotatedX];
                    } else {
                        // Jeśli piksel wychodzi poza granice obrazu, przypisz wartość 0 (lub inny wartość oznaczającą brak piksela)
                        rotatedImage[y][x] = 0;
                    }
                }
            }

            return rotatedImage;
        }

        static getImageFromSimogram(sinogram, step, angleStep) {
            let heigth = sinogram[step].length;
            let angle = step * angleStep;
            let result = [];
            for (let n=0; n<heigth; n++) {
                result[n] = sinogram[step];
            }
            return this.rotateAndSmoothImage(result,angle);
        }

        static sumArrays(ar1,ar2) {
            let result = []
            for (let x=0; x<ar1.length; x++) {
                result [x] = [];
                for (let y=0; y<ar1[x].length; y++) {
                    result[x][y] = ar1[x][y] + ar2[x][y];
                }
            }
            return result;
        }

        static cutoffEdges(image) {
            let r = image.length/2;
            let minimum = image[0][0];
            for (let x=0; x<image.length; x++) {
                for (let y=0; y<image[0].length; y++) {
                    if (((x-r)**2 + (y-r)**2 <= ((r-5)**2)) && image[x][y]<minimum) {
                        minimum = image[x][y];
                    }
                }
            }
            for (let x=0; x<image.length; x++) {
                for (let y=0; y<image[0].length; y++) {
                    if ((x-r)**2 + (y-r)**2 > ((r-5)**2)) {
                        image[x][y] = minimum;
                    }
                }
            }
            return image;
        }

        static cutoffEdgesComplex(image) {
            let r = image.length/2;
            for (let x=0; x<image.length; x++) {
                for (let y=0; y<image[0].length; y++) {
                    if ((x-r)**2 + (y-r)**2 > ((r)**2)) {
                        //image[x][y] = {re: 0, im: 0};
                        image[x][y].re = 0;
                        image[x][y].im = 0;
                    }
                }
            }
            return image;
        }

        static processSinogram(sinogram, angleStep, anglesCount) {
            let result = this.getImageFromSimogram(sinogram,0,angleStep);
            for (let n=1; n<anglesCount; n++) {
                let current = this.getImageFromSimogram(sinogram,n,angleStep);
                result = this.sumArrays(result,current);
            }
            result = this.cutoffEdges(result);
            return result;
        }

    static shiftArray(inputArr) {
        let shiftVal = Math.floor(inputArr.length/2);
        let shiftValY = Math.floor(inputArr[0].length/2);
        let result = [];
        for (let i = 0; i< inputArr.length; i++) {
            let index = (i+shiftVal)%inputArr.length;
            let row = [];
            for(let j = 0; j< inputArr[index].length; j++) {
                let indexJ = (j+shiftValY)%inputArr[index].length;
                row.push(inputArr[index][indexJ]);
            }
            result.push(row);
        }
        return result;
    }

    static flipArray(inputArr) {
        let shiftVal = Math.floor(inputArr.length/2);
        let result = [];
        for (let i = 0; i< inputArr.length; i++) {
            let index = inputArr.length - i - 1;
            result.push(inputArr[index]);
        }
        return result;
    }

    static arrayDiffComplex(a1,a2) {
        let result = [];
        for (let x=0; x<a1.length; x++) {
            let row = [];
            for (let y=0; y<a1[0].length; y++) {
                let diff = {
                    re: a1[x][y].re / a2[x][y].re,
                    im: a1[x][y].im / a2[x][y].im,
                }
                row.push(diff);
                //let real = Math.sqrt(diff.re**2 + diff.im**2);
                //row.push(real);
            }
            result.push(row)
        }
        return result;
    }
}

export default ImageManipulation;