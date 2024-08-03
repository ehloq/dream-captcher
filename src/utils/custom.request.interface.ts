import { IncomingHttpHeaders } from "http";
import { Request } from "express";

// Extiende el tipo Request para incluir tu propiedad personalizada
interface CustomRequest extends Request {
    myAwesomeProperty?: number;
    headers: IncomingHttpHeaders  & {
        identifier?: string;
    };
    body: any;
}

export { CustomRequest }