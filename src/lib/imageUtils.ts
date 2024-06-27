import Jimp from 'jimp';
import { BoundingRect } from '../types/commonTypes';

export function findBoundingRect(jimp: Jimp, grayScaleWhiteThreshold: number): BoundingRect {
    // note this is only for testing / prototyping
    let top = Number.MAX_VALUE;
    let bottom = Number.MIN_VALUE;
    let right = Number.MIN_VALUE;
    let left = Number.MAX_VALUE;

    for (let i = 0; i < jimp.getHeight(); i++) {
        for (let j = 0; j < jimp.getWidth(); j++) {
            const rgba = Jimp.intToRGBA(jimp.getPixelColor(j, i));
            if ((rgba.r + rgba.g + rgba.b) / 3 <= grayScaleWhiteThreshold) {
                top = Math.min(i, top);
                bottom = Math.max(i, bottom);
                left = Math.min(j, left);
                right = Math.max(j, right);
            }
        }
    }

    return { topleft: { r: top, c: left }, bottomRight: { r: bottom, c: right } };
}

export function resizeImage(inputJimp: Jimp, boundingRect: BoundingRect, padding: number, outputHeight: number, outputWidth: number): Jimp {
    let top = boundingRect.topleft.r;
    let left = boundingRect.topleft.c;
    let bottom = boundingRect.bottomRight.r;
    let right = boundingRect.bottomRight.c;

    inputJimp.crop(left, top, right - left, bottom - top).resize(outputWidth - padding * 2, outputHeight - padding * 2);
    const imageWithWhiteBorder = new Jimp(outputWidth, outputHeight, 'white').blit(inputJimp, 1, 1);
    return imageWithWhiteBorder;
}
