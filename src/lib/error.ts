import { Response } from 'express-serve-static-core';
import { HttpStatusCode } from 'axios';
import { DoNotRespondError, NotFoundError } from '../types/commonTypes';

export function processError(e: any, res: Response<any, Record<string, any>, number>) {
    if (e instanceof DoNotRespondError) {
        console.log(e);
        return;
    }

    if (e instanceof NotFoundError) {
        res.status(HttpStatusCode.NotFound).send(e.message);
        return;
    }

    res.status(HttpStatusCode.InternalServerError).send(e.message);
}
