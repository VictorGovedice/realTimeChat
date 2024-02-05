import express, { Application, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

class App {
    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.listenSocket();
        this.setupRoutes();
    }

    listenServer() {
        const port = process.env.PORT || 3000;
        this.http.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
    }

    listenSocket() {
        this.io.on('connection', (socket: Socket) => {
            console.log('Usuário conectado =>', socket.id);

            socket.on('message', (msg: { id: string; message: string }) => {
                this.io.emit('message', { id: msg.id, message: msg.message });
            });
        });
    }

    setupRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '..', 'index.html'));
        });
    }
}

const app = new App();
app.listenServer();
