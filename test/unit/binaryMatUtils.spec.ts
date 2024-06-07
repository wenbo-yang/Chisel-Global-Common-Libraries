import { convertCompressedStringToMat, convertMatToCompressedString } from '../../src/lib/binaryMatUtils';

describe('BinaryMatUtils', () => {
    describe('convertCompressedStringTo2DMat', () => {
        it('should convert a compressed string to 2D mat', async () => {
            const input = [
                [0, 0, 1],
                [0, 1, 0],
                [1, 0, 0],
                [1, 1, 0],
            ];
            const compressedBinaryImage = await convertMatToCompressedString(input);
            const output = await convertCompressedStringToMat(compressedBinaryImage);

            expect(output).toEqual(input);
        });
    });
});
