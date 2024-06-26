export interface IServiceConfig {
    serviceName: string;
    shortName: string;
}

export interface IServicePorts {
    http: number;
    https: number;
}

export interface CompressedBinaryImage {
    height: number;
    width: number;
    compressedData: string;
}

export enum IMAGEDATATYPE {
    BINARYSTRING = 'BINARYSTRING',
    BINARYSTRINGWITHNEWLINE = 'BINARYSTRINGWITHNEWLINE',
    BMP = 'BMP',
    PNG = 'PNG',
    PNGIMAGEPATH = 'PNGIMAGEPATH',
}

export enum COMPRESSIONTYPE {
    GZIP = 'GZIP',
    PLAIN = 'PLAIN',
}

export class NotFoundError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class DoNotRespondError extends Error {
    constructor(e: Error) {
        super(e.message);
    }
}

export interface Point {
    r: number;
    c: number;
}

export interface BoundingRect {
    topleft: Point;
    bottomRight: Point;
}
