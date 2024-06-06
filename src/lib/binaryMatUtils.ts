import { decode } from 'bmp-js';
import { CompressedBinaryImage } from '../types/commonTypes';
import { gzip, ungzip } from 'node-gzip';

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

export function convert2DMatToNewLineSeparatedString(mat: number[][]): string {
    let output = '';

    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
            output += mat[i][j].toString();
        }
        if (i != mat.length - 1) {
            output += '\n';
        }
    }

    return output;
}

export async function convert2DMatTo1DCompressedString(mat: number[][]): Promise<CompressedBinaryImage> {
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

export async function convert1DCompressedStringTo2DMat(compressedBinaryImage: CompressedBinaryImage): Promise<number[][]> {
    const uncompressedData = Buffer.from(await ungzip(Buffer.from(compressedBinaryImage.compressedData))).toString();

    const mat: number[][] = []
    let index = 0;
    for(let i = 0; i < compressedBinaryImage.height; i++) {
        const row: number[] = [];
        for (let j = 0; j < compressedBinaryImage.width; j++) {
            row.push(uncompressedData.charAt(index) === '1' ?  1 : 0)
            index++;
        }
        mat.push(row);
    }
    
    return mat;
}
