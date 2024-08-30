import cors from 'cors';
// import morgan from 'morgan';
import Routes from './routes/routes.js';
import * as exphbs from 'express-handlebars';
import express, { Express, Request, Response, NextFunction } from 'express';
import './database/connection.js';
import { CustomRequest } from './utils/custom.request.interface.js';
import { allowCheckWords, allowLoadWords, allowSaveWords } from './utils/allowed_words.js';
import path from 'path';
import { fileURLToPath } from 'url';
import * as http from 'http';
import WebSocketPool from './class/websocketPool.js';
import Logger from './class/logger.js';
import requestIp from 'request-ip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializations
const app: Express = express();
const server = http.createServer(app);

// Logger
const logger = new Logger();

// Inicializando servidor WebSockets
WebSocketPool.createWebSocketServer(server);

const port = process.env.PORT || 3000;

// Configura express-handlebars
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.create({
    defaultLayout: "",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
}).engine);

// Middlewares
app.use(cors());
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('x-powered-by');

// Middleware para manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const extractDataFromUrl = (url: string): {
    fileName: string;
    identifier: string;
    checkWord: boolean;
    loadWord: boolean;
    saveWord: boolean;
} | null => {
    const identifierMatch = url.match(/\?([a-zA-Z0-9]{24})/);
    if (!identifierMatch) {
        logger.error("No se ha encontrado un identificador en la URL");
        return null;
    }

    const allowCheckWord = allowCheckWords.some(word => containsWholeWord(url, word));
    const allowLoadWord  = allowLoadWords.some(word => containsWholeWord(url, word));
    const allowSaveWord  = allowSaveWords.some(word => containsWholeWord(url, word));
    if (!allowCheckWord && !allowLoadWord && !allowSaveWord) {

        if(!allowCheckWord) {
            logger.error("No se ha encontrado ninguna palabra permitida para Check");
        }

        if(!allowLoadWord){
            logger.error("No se ha encontrado ninguna palabra permitida para Load");
        }

        if(!allowSaveWord){
            logger.error("No se ha encontrado ninguna palabra permitida para Save");
        }

        return null;
    }

    let fileNameMatch: string = "";
    if (allowCheckWord) {
        const matchResult = url.match(/\/([a-zA-Z]{11}\.js)\?/);
        if (!matchResult) {
            logger.error("No se ha encontrado el ([a-zA-Z]{11}\.js)");
            return null;
        }
        fileNameMatch = matchResult[1];
    } else if (allowLoadWord) {
        fileNameMatch = "load";
    } else if (allowSaveWord) {
        fileNameMatch = "save";
    } else {
        return null;
    }

    return {
        fileName: fileNameMatch,
        identifier: identifierMatch[1],
        checkWord: allowCheckWord,
        loadWord: allowLoadWord,
        saveWord: allowSaveWord
    };
}

const getClientIp = (req: express.Request): string => {
    // Intenta obtener la IP del cliente desde los encabezados comunes
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['cf-connecting-ip'];
    
    if (ip) {
        // Si hay múltiples IPs en el encabezado 'x-forwarded-for', toma la primera
        return Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();
    }

    // Si no se encuentra en los encabezados, usa request-ip para obtener la IP
    return requestIp.getClientIp(req) || '';
};

const interceptorMiddleware = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const userAgent = req.headers['user-agent'] || "";

    const clientIp = getClientIp(req);
    console.log(`Client IP: ${clientIp}`);
    
    logger.neutral(`METHOD: ${req.method} | URL: ${req.url}`);
    
    if (req.url.includes('favicon.ico')) {
        logger.error("Favicon.ico no permitido");
        // return res.status(204).send();
        return next();
    }

    const extractData = extractDataFromUrl(req.url);

    if (req.url === "/") {
        return next();
    }

    if (req.url.includes('ehloq-check') ||
        req.url.includes('ehloq-load') ||
        req.url.includes('ehloq-save')) {
        logger.error("URL no permitida");
        return res.status(404).send('Not Found');
    }

    if (!extractData) {
        // req.url = '/nofound';
        // return next();
        logger.error("NO extractData");
        return res.status(404);
    }

    // if (!extractData.checkWord && !extractData.loadWord && !extractData.saveWord) {
    //     logger.error("No se ha encontrado ninguna palabra permitida en la URL");
    //     req.url = '/nofound';
    //     return next();
    // }

    const forbiddenWordsRegex = /sp1a|width|dalvik|height|density|supportsfresco|scaleddensity|displaymetrics|externalhit_uatext|facebookexternalhit|audiencenetworkforwindows/i;
    if (forbiddenWordsRegex.test(userAgent)) {
        logger.error("Palabra prohibida encontrada en el agente de usuario");
        req.url = '/nofound';
        return next();
    }

    // VERIFICADOR DE EHLOQBOOK
    const ehloqbookRegex = /(FB(AN|AV)|\[FB])/i;
    if (!userAgent.match(ehloqbookRegex)) {
        logger.error("No es un agente de usuario de EhloqBook");
        // req.url = '/nofound';
        return res.status(404);
        // return next();
    }

    req.headers.identifier = extractData.identifier;
    if (req.method === 'GET') {
        if (extractData.checkWord) {
            req.url = '/ehloq-check';
        } else {
            req.url = '/ehloq-load';
        }
    } else if (req.method === 'POST') {
        req.url = '/ehloq-save';
    }

    return next();
};

// Crear una función para verificar si una palabra está contenida como palabra completa
function containsWholeWord(text: string, word: string) {
    const regex = new RegExp(`\\b${word}\\b`);
    return regex.test(text);
}

app.use(interceptorMiddleware);

// Routes
app.use('/', Routes);

server.listen(port, () => {
    // console.log(`[server]: Server is running at http://localhost:${port}`);
    logger.info(`[System]: Server is running at http://localhost:${port}`);
});