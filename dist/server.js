import cors from 'cors';
import morgan from 'morgan';
import Routes from './routes/routes.js';
import * as exphbs from 'express-handlebars';
import express from 'express';
import './database/connection.js';
import { allowCheckWords, allowLoadWords, allowSaveWords } from './utils/allowed_words.js';
import path from 'path';
import { fileURLToPath } from 'url';
import * as http from 'http';
import WebSocketPool from './class/websocketPool.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
WebSocketPool.createWebSocketServer(server);
const port = process.env.PORT || 3000;
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.create({
    defaultLayout: "",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
}).engine);
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('x-powered-by');
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const extractDataFromUrl = (url) => {
    const identifierMatch = url.match(/\?([a-zA-Z0-9]{24})/);
    if (!identifierMatch) {
        return null;
    }
    const allowCheckWord = allowCheckWords.some(word => containsWholeWord(url, word));
    const allowLoadWord = allowLoadWords.some(word => containsWholeWord(url, word));
    const allowSaveWord = allowSaveWords.some(word => containsWholeWord(url, word));
    if (!allowCheckWord && !allowLoadWord && !allowSaveWord) {
        return null;
    }
    let fileNameMatch = "";
    if (allowCheckWord) {
        const matchResult = url.match(/\/([a-zA-Z]{11}\.js)\?/);
        if (!matchResult) {
            return null;
        }
        fileNameMatch = matchResult[1];
    }
    else if (allowLoadWord) {
        fileNameMatch = "load";
    }
    else if (allowSaveWord) {
        fileNameMatch = "save";
    }
    else {
        return null;
    }
    return {
        fileName: fileNameMatch,
        identifier: identifierMatch[1],
        checkWord: allowCheckWord,
        loadWord: allowLoadWord,
        saveWord: allowSaveWord
    };
};
const interceptorMiddleware = (req, res, next) => {
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
    req.headers.identifier = extractData.identifier;
    if (req.method === 'GET') {
        if (extractData.checkWord) {
            req.url = '/ehloq-check';
        }
        else {
            req.url = '/ehloq-load';
        }
    }
    else if (req.method === 'POST') {
        req.url = '/ehloq-save';
    }
    return next();
};
function containsWholeWord(text, word) {
    const regex = new RegExp(`\\b${word}\\b`);
    return regex.test(text);
}
app.use(interceptorMiddleware);
app.use('/', Routes);
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
