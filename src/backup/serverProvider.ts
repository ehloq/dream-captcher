import * as http from 'http';

class ServerProvider {
    private static _serverInstance: http.Server;

    static setServer(server: http.Server) {
        this._serverInstance = server;
    }

    static getServer(): http.Server {
        return this._serverInstance;
    }
}

export default ServerProvider;