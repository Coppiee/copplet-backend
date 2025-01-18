import { WebSocketServer } from "ws";

const webSocketServer = (port) => {
    const wss = new WebSocketServer({ port });

    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
            ws.send(message);
        });

        ws.on('close', () => {
            console.log("Client disconnected");
        });
    });

    console.log("WebSocket Server is running!");
};

webSocketServer(8080);
