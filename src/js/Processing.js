import {fft, ifft, isArray} from 'mathjs';

class Processing {


    static ifftReal(input) {
        let result = ifft(input);
        function reqFlat(arr) {
            if (Array.isArray(arr)) {
                for (let n = 0 ; n<arr.length ; n++) {
                    arr[n] = reqFlat(arr[n]);
                }
                return arr;
            }
            else {
                return arr.re;
            }
        }
        reqFlat(result);
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
        const spectrum = fft(signal);
        const N = spectrum.length;

        // Tworzenie maski filtru rampowego
        const rampFilterMask = new Array(N);
        const middleIndex = Math.floor(N / 2);

        for (let i = 0; i < N; i++) {
            rampFilterMask[i] = 1 - Math.abs(i - middleIndex) / middleIndex;
        }

        // Mnożenie widma sygnału przez maskę filtru rampowego
        for (let i = 0; i < N; i++) {
            spectrum[i].re *= rampFilterMask[i];
            spectrum[i].im *= rampFilterMask[i];
        }

        // Obliczanie odwrotnej DFT (iDFT) przefiltrowanego widma
        const filteredSignal = this.ifftReal(spectrum);

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