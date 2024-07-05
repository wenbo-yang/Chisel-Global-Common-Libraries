import { decode } from 'bmp-js';
import { COMPRESSIONTYPE, CompressedBinaryImage, Point } from '../types/commonTypes';
import { gzip, ungzip } from 'node-gzip';
import Jimp from 'jimp';

export async function convertBitmapDataToZeroOneMat(bitMapBuffer: Buffer, grayScaleWhiteThreshold: number): Promise<number[][]> {
    const bmpData = decode(bitMapBuffer);
    const mat: number[][] = [];

    let index = 0;

    for (let i = 0; i < bmpData.height; i++) {
        const row: number[] = [];
        for (let j = 0; j < bmpData.width; j++) {
            if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
                // make sure edges are cleared
                row.push(0);
            } else if (bmpData.data[index + 1] > grayScaleWhiteThreshold) {
                row.push(0);
            } else if (bmpData.data[index + 1] <= grayScaleWhiteThreshold) {
                row.push(1);
            }
            index += 4;
        }

        mat.push(row);
    }

    return mat;
}

export async function convertNewLineSeparatedStringToImage(binaryMatString: string, outputCompression: COMPRESSIONTYPE): Promise<string> {
    if (!binaryMatString.includes('\n')) {
        throw new Error('binary mat does not have newline separator.');
    }

    const binaryMat = binaryMatString.split('\n');

    const height = binaryMat.length;
    const width = binaryMat[0].length;

    const jimp = new Jimp(width, height, 'white');
    const hexBlackColor = Jimp.rgbaToInt(1, 1, 1, 255);

    for (let i = 0; i < jimp.bitmap.height; i++) {
        for (let j = 0; j < jimp.bitmap.width; j++) {
            if (binaryMat[i].charAt(j) === '1') {
                jimp.setPixelColor(hexBlackColor, j, i);
            }
        }
    }

    const buffer = await jimp.getBufferAsync(Jimp.MIME_PNG);

    return outputCompression === COMPRESSIONTYPE.GZIP ? Buffer.from(await gzip(buffer)).toString('base64') : buffer.toString('base64');
}

export async function convertMatToImage(mat: number[][], outputCompression: COMPRESSIONTYPE): Promise<string> {
    const height = mat.length;
    const width = mat[0].length;

    const jimp = new Jimp(width, height, 'white');
    const hexBlackColor = Jimp.rgbaToInt(1, 1, 1, 255);

    for (let i = 0; i < jimp.bitmap.height; i++) {
        for (let j = 0; j < jimp.bitmap.width; j++) {
            if (mat[i][j] === 1) {
                jimp.setPixelColor(hexBlackColor, j, i);
            }
        }
    }

    const buffer = await jimp.getBufferAsync(Jimp.MIME_PNG);

    return outputCompression === COMPRESSIONTYPE.GZIP ? Buffer.from(await gzip(buffer)).toString('base64') : buffer.toString('base64');
}

export async function convertMatToNewLineSeparatedString(mat: number[][], outputCompression: COMPRESSIONTYPE): Promise<string> {
    let output = '';

    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
            output += mat[i][j].toString();
        }
        if (i != mat.length - 1) {
            output += '\n';
        }
    }

    return outputCompression === COMPRESSIONTYPE.GZIP ? (await gzip(Buffer.from(output))).toString('base64') : output;
}

export async function convertMatToCompressedString(mat: number[][]): Promise<CompressedBinaryImage> {
    let output = '';
    const height = mat.length;
    const width = mat[0].length;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            output += mat[i][j].toString();
        }
    }

    const compressedData = Buffer.from(await gzip(Buffer.from(output))).toString('base64');
    return { height, width, compressedData };
}

export async function convertCompressedStringToMat(compressedBinaryImage: CompressedBinaryImage): Promise<number[][]> {
    const uncompressedData = Buffer.from(await ungzip(Buffer.from(compressedBinaryImage.compressedData, 'base64'))).toString();

    const mat: number[][] = [];
    let index = 0;
    for (let i = 0; i < compressedBinaryImage.height; i++) {
        const row: number[] = [];
        for (let j = 0; j < compressedBinaryImage.width; j++) {
            row.push(uncompressedData.charAt(index) === '1' ? 1 : 0);
            index++;
        }
        mat.push(row);
    }

    return mat;
}

export function logMat(mat: number[][]): void {
    const row = mat.length;
    let output = '';
    for (let i = 0; i < row; i++) {
        output += mat[i].join('') + '\n';
    }

    console.log(output);
}

export function trimBinaryMat(mat: number[][]): number[][] {
    const offsets = getOffsetsFromMat(mat);
    let trimmedMat: Array<Array<number>> = generateMat(offsets[1].r - offsets[0].r + 3, offsets[1].c - offsets[0].c + 3);

    for (let i = 1; i < trimmedMat.length - 1; i++) {
        for (let j = 1; j < trimmedMat[0].length - 1; j++) {
            trimmedMat[i][j] = mat[i + offsets[0].r][j + offsets[0].c];
        }
    }

    return trimmedMat;
}

export function getOffsetsFromPointList(points: Point[]): Point[] {
    let top = Number.MAX_VALUE;
    let bottom = Number.MIN_VALUE;
    let right = Number.MIN_VALUE;
    let left = Number.MAX_VALUE;

    for (let i = 0; i < points.length; i++) {
        top = Math.min(points[i].r, top);
        bottom = Math.max(points[i].r, bottom);
        left = Math.min(points[i].c, left);
        right = Math.max(points[i].c, right);
    }

    return [
        { r: top, c: left },
        { r: bottom, c: right },
    ];
}

export function getOffsetsFromMat(mat: number[][]): Point[] {
    let top = Number.MAX_VALUE;
    let bottom = Number.MIN_VALUE;
    let right = Number.MIN_VALUE;
    let left = Number.MAX_VALUE;

    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
            if (mat[i][j] === 1) {
                top = Math.min(i, top);
                bottom = Math.max(i, bottom);
                left = Math.min(j, left);
                right = Math.max(j, right);
            }
        }
    }

    return [
        { r: top, c: left },
        { r: bottom, c: right },
    ];
}

export function generateMat(numRows: number, numCols: number, initValue: number = 0): number[][] {
    // prettier-ignore
    return Array<Array<number>>(numRows).fill([]).map(() => Array<number>(numCols).fill(initValue));
}
