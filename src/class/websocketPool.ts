// import os from 'os';
import * as http from 'http';
import geoip from 'geoip-lite';
import Logger from './logger.js';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import BrowserPool from './browserPool.js';
import WebSocket, { WebSocketServer } from 'ws';
import * as UserDB from '../database/user/user.database.js'
import { UserInfo } from '../utils/user.info.interface.js';

class WebSocketPool {
    private static maxConnections = 100;
    private static activeConnections = 0;
    private static userInfo: UserInfo;
    
    private static logger = new Logger();
    private static clients = new Map<string, WebSocket>();
    private static browserPool = BrowserPool.getInstance(true);

    static createWebSocketServer(server: http.Server): WebSocket.Server | void {
        const webSocket = new WebSocketServer({ server: server, path: "/ws" });

        webSocket.on('connection', async (ws, req) => {
            try {
                if (WebSocketPool.activeConnections >= WebSocketPool.maxConnections) {
                    ws.send(JSON.stringify({ event: 'end' }));
                    ws.close(1001, 'Server is full');
                    return;
                }
    
                const clientId = uuidv4();
                WebSocketPool.clients.set(clientId, ws);
                WebSocketPool.activeConnections++;

                this.userInfo = await WebSocketPool.getUserInfo(req);
                // console.log('UserInfo => ', this.userInfo);
                this.handleClient(ws, clientId);
            } catch (error) {
                console.error('Error handling connection:', error);
                ws.send(JSON.stringify({ event: 'end' }));
                ws.close(1011, 'Internal server error');
            }
        });

        // setInterval(WebSocketPool.logMemoryUsage, 30000);
    }

    private static async getUserInfo(req: http.IncomingMessage): Promise<UserInfo> {
        try {
            const clientIp      = WebSocketPool.getClientIp(req);
            const identifier  = WebSocketPool.getIdentifier(req);
            const countryCode = WebSocketPool.getClientCountry(clientIp);
    
            const user = await UserDB.getUserById(identifier);
            if (!user) {
                throw new Error('No se ha podido obtener la información del usuario');
            }
    
            const config = user.config;
            const percent = user.percent;
            const username = user.username;
            return { clientIp, username, identifier, countryCode, config, percent };
        } catch (error) {
            throw error;
        }
    }

    private static async handleClient(ws: WebSocket, clientId: string) {
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                switch (data.event) {
                    case 'userForm':
                        await this.browserPool.runPlaywright(clientId, ws, this.userInfo, data.data);
                        break;
                    case 'ping':
                        ws.send(JSON.stringify({ event: 'pong' }));
                        this.logger.neutral(`Pong enviado al cliente ${clientId}`);
                        break;
                }
            } catch (error) {
                console.error('Error handling message:', error);
                ws.send(JSON.stringify({ event: 'redirect' }));
            }
        });

        ws.on('close', async () => {
            WebSocketPool.clients.delete(clientId);
            WebSocketPool.activeConnections--;
            await this.browserPool.releaseBrowserContext(clientId);
            this.logger.error(`Cliente ${clientId} descocnetado`);
        });
    }

    private static getClientIp(req: http.IncomingMessage): string {
        const userIp = requestIp.getClientIp(req);
        if (!userIp) {
            throw new Error('No se ha podido obtener la IP del cliente');
        }
        return userIp;
    }

    private static getIdentifier(req: http.IncomingMessage): string {
        const identifier = req.url?.split('=')[1];
        if (!identifier || identifier.length !== 24) {
            throw new Error('No se ha proporcionado un identificador');
        }

        return identifier;
    }

    private static getClientCountry(clientIp: string): string {
        const geoInfo = geoip.lookup(clientIp);
        if (!geoInfo || !geoInfo.country) {
            throw new Error('No se ha podido obtener la información geográfica');
        }
        return geoInfo.country;
    }

    // private static logMemoryUsage() {
    //     const totalMemory = os.totalmem();
    //     const freeMemory = os.freemem();
    //     const usedMemory = totalMemory - freeMemory;
    //     const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

    //     // console.log(`Total Memory: ${totalMemory / (1024 * 1024)} MB`);
    //     // console.log(`Used Memory: ${usedMemory / (1024 * 1024)} MB`);
    //     // console.log(`Memory Usage: ${usedMemoryPercentage.toFixed(2)}%`);

    //     WebSocketPool.logger.neutral(`Total: ${totalMemory / (1024 * 1024)} MB | Used: ${usedMemory / (1024 * 1024)} MB | Usage: ${usedMemoryPercentage.toFixed(2)}%`);
    // }
}

export default WebSocketPool;