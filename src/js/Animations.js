import Paint from "./Paint.js";
import ImageManipulation from "./ImageManipulation.js";

class Animations {
    static CTscan(step, ctx, sharedResults, photosPerIteration, images) {
        ctx.drawImage(images[0], 0, 0);
        Paint.drawTestImage(ctx, sharedResults.transBitmap, 95, 95, 1);

        const angle = (step*photosPerIteration)*sharedResults.deltaAngle + Math.PI/2;
        ctx.translate(350,350);
        ctx.rotate(angle);
        ctx.drawImage(images[1], -350, -350);
        ctx.rotate(-angle);
        ctx.translate(-350,-350);

        let firstFrame = step*photosPerIteration;
        let lastFrame = (step+1)*photosPerIteration-1;
        Paint.drawPolarImage(ctx, sharedResults.sinogram, sharedResults.deltaAngle, sharedResults.rayres, sharedResults.bitmap.length, 750, 100, 1, false, false, firstFrame, lastFrame);
        Paint.drawTestImage(ctx, sharedResults.sinogram, 1300, 100, 1, false, firstFrame, lastFrame, false);
    }

    static sumIter(step, ctx, sharedResults, photosPerIteration, filtered = false) {
        let firstFrame = step*photosPerIteration;
        let lastFrame = (step+1)*photosPerIteration-1;
        let sinogram = filtered ? sharedResults.filteredSinogram : sharedResults.sinogram;
        sharedResults.additiveData = ImageManipulation.processSinogramAdditive(sinogram, sharedResults.deltaAngle, sharedResults.numOfPhotos, firstFrame, lastFrame, sharedResults.additiveData);
        Paint.drawTestImage(ctx, sharedResults.additiveData, 0, 0, 1);

        let imageCurr = ImageManipulation.getImageFromSinogram(sinogram,firstFrame,sharedResults.deltaAngle);
        Paint.drawTestImage(ctx, imageCurr, 600, 0, 1);
    }

    static filteringSinogram(step, ctx, sharedResults, photosPerIteration) {
        let firstFrame = step*photosPerIteration;
        let lastFrame = (step+1)*photosPerIteration;
        Paint.drawTestImage(ctx, sharedResults.filteredSinogram, 1300, 0, 1, false, firstFrame, lastFrame, false);
    }

    static fftSinogram(step, ctx, sharedResults, photosPerIteration) {
        let firstFrame = step*photosPerIteration;
        let lastFrame = (step+1)*photosPerIteration;
        Paint.drawPolarImage(ctx, sharedResults.sinogramAfterDFT, sharedResults.deltaAngle, sharedResults.rayres, sharedResults.bitmap.length, 750, 0, 1, true, false, firstFrame, lastFrame);
        Paint.drawTestImage(ctx, sharedResults.sinogramAfterDFT, 1300, 0, 1, true, firstFrame, lastFrame, false);
    }
}

export default Animations;