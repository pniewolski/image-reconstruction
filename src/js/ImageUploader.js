class ImageUploader {

    static convertImageToMatrix(image) {
        const canvas = document.getElementById("hiddencanvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const matrix = [];

        for (let i = 0; i < canvas.height; i++) {
            const row = [];
            for (let j = 0; j < canvas.width; j++) {
                const index = (i * canvas.width + j) * 4;
                const red = imageData[index];
                const green = imageData[index + 1];
                const blue = imageData[index + 2];
                const alpha = imageData[index + 3];
                const grayscale = (red + green + blue) / 3 / 255;
                row.push(grayscale);
            }
            matrix.push(row);
        }

        return matrix;
    }

    static handleImageUpload(event,callback) {
        const file = event.target.files[0];
        const image = new Image();
        image.onload = function() {
            const matrix = ImageUploader.convertImageToMatrix(image);
            console.log(matrix);
            callback(matrix);
        };
        image.src = URL.createObjectURL(file);
    }

}

export default ImageUploader;