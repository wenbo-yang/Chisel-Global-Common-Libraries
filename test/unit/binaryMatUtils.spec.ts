import { convert2DMatToCompressedString, convertCompressedStringTo2DMat } from '../../src/lib/binaryMatUtils';

describe('BinaryMatUtils', () => {
    describe('convertCompressedStringTo2DMat', () => {
        it('should convert a compressed string to 2D mat', async () => {
            const input = [
                [0, 0, 1],
                [0, 1, 0],
                [1, 0, 0],
                [1, 1, 0],
            ];
            const compressedBinaryImage = await convert2DMatToCompressedString(input);
            const output = await convertCompressedStringTo2DMat(compressedBinaryImage);

            expect(output).toEqual(input);
        });
    });
});
