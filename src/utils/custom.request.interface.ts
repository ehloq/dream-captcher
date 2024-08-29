import { IncomingHttpHeaders } from "http";
import { Request } from "express";

import { WebSocketServer } from 'ws';

// Extiende el tipo Request para incluir tu propiedad personalizada
interface CustomRequest extends Request {
    myAwesomeProperty?: number;
    headers: IncomingHttpHeaders  & {
        identifier?: string;
    };
    ws?: WebSocketServer;
    websocket?: any;
    body: any;
}

export { CustomRequest }