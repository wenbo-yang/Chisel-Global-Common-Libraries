
export interface IServiceConfig {
    serviceName: string;
    shortName: string;
}

export interface IServicePorts {
    http: number;
    https: number;
}

export enum IMAGEDATATYPE {
    BINARYSTRING = 'BINARYSTRING',
    BINARYSTRINGWITHNEWLINE = 'BINARYSTRINGWITHNEWLINE',
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
