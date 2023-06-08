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


    static calculateIDFT(input) {
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

}

export default Processing;