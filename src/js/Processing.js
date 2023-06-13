class Processing {
    static calculateDFT(signal) {
        const N = signal.length;
        const spectrum = [];

        for (let k = 0; k < N; k++) {
            let real = 0;
            let imag = 0;

            for (let n = 0; n < N; n++) {
                const angle = (2 * Math.PI * k * n) / N;
                real += signal[n] * Math.cos(angle);
                imag -= signal[n] * Math.sin(angle);
            }

            spectrum.push({ real, imag });
            //spectrum.push(real+imag);
        }

        return spectrum;
    }

    static calculateIDFT(spectrum) {
        const N = spectrum.length;
        const signal = new Array(N);

        for (let n = 0; n < N; n++) {
            let value = 0;

            for (let k = 0; k < N; k++) {
                const angle = (2 * Math.PI * k * n) / N;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                value += (spectrum[k].real * cos) - (spectrum[k].imag * sin);
            }

            signal[n] = value / N;
        }

        return signal;
    }

    static calculateDFT_2d(inputArray) {
        const numRows = inputArray.length;
        const numCols = inputArray[0].length;

        const outputArray = [];

        for (let u = 0; u < numRows; u++) {
            const row = [];
            for (let v = 0; v < numCols; v++) {
                let real = 0;
                let imag = 0;

                for (let x = 0; x < numRows; x++) {
                    for (let y = 0; y < numCols; y++) {
                        const angle = (2 * Math.PI * ((u * x / numRows) + (v * y / numCols)));
                        const cosVal = Math.cos(angle);
                        const sinVal = Math.sin(angle);

                        real += inputArray[x][y] * cosVal;
                        imag -= inputArray[x][y] * sinVal;
                    }
                }

                row.push({ real, imag });
            }

            outputArray.push(row);
        }

        return outputArray;
    }


    static calculateIDFT_2d(input) {
        const rows = input.length;
        const cols = input[0].length;

        // Tworzenie tablicy wynikowej
        const result = [];

        // Inicjalizacja wynikowej tablicy zerami
        for (let i = 0; i < rows; i++) {
            result[i] = new Array(cols).fill(0);
        }

        // Przeprowadzenie odwrotnej transformacji Fouriera
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let sumReal = 0;
                let sumImaginary = 0;

                for (let u = 0; u < cols; u++) {
                    for (let v = 0; v < rows; v++) {
                        const angle = (2 * Math.PI * ((u * x) / cols + (v * y) / rows));
                        const cos = Math.cos(angle);
                        const sin = Math.sin(angle);
                        const real = input[v][u].real;
                        const imaginary = input[v][u].imag;

                        // Sumowanie składowych rzeczywistej i urojonej części
                        sumReal += (real * cos - imaginary * sin);
                        sumImaginary += (real * sin + imaginary * cos);
                    }
                }

                // Przypisanie wartości do wynikowej tablicy
                result[y][x] = sumReal / (rows * cols);
            }
        }

        return result;
    }

    static applyRampFilter(sinogram) {
        const numDetectors = sinogram.length;

        const filteredSinogram = [];

        for (let i = 0; i < numDetectors; i++) {
            let result = this.rampFilter(sinogram[i]);
            filteredSinogram.push(result);
        }

        return filteredSinogram;
    }

    static rampFilter(signal) {
        const spectrum = this.calculateDFT(signal);
        const N = spectrum.length;

        // Tworzenie maski filtru rampowego
        const rampFilterMask = new Array(N);
        const middleIndex = Math.floor(N / 2);

        for (let i = 0; i < N; i++) {
            rampFilterMask[i] = 1 - Math.abs(i - middleIndex) / middleIndex;
        }

        // Mnożenie widma sygnału przez maskę filtru rampowego
        for (let i = 0; i < N; i++) {
            spectrum[i].real *= rampFilterMask[i];
            spectrum[i].imag *= rampFilterMask[i];
        }

        // Obliczanie odwrotnej DFT (iDFT) przefiltrowanego widma
        const filteredSignal = this.calculateIDFT(spectrum);

        return filteredSignal;
    }

    static transposeArray(array) {
        // Sprawdź rozmiary tablicy wejściowej
        const rows = array.length;
        const cols = array[0].length;

        // Inicjalizuj pustą tablicę wynikową
        const transposedArray = new Array(cols);
        for (let i = 0; i < cols; i++) {
            transposedArray[i] = new Array(rows);
        }

        // Przejdź przez elementy tablicy wejściowej i przepisz do tablicy wynikowej
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                transposedArray[j][i] = array[i][j];
            }
        }

        return transposedArray;
    }

}

export default Processing;