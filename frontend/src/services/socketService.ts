import { io, Socket } from "socket.io-client";

class SocketService {
    public socket: Socket | null = null;

    public connect(url: string) {
        return new Promise((resolve, reject) => {
            this.socket = io(url);

            if (!this.socket) {
                reject("Socket is null");
            }

            this.socket.on("connect", () => {
                resolve(this.socket);
            });

            this.socket.on("connect_error", (error) => {
                console.log("connect_error", error);
                reject(error);
            });
        });
    }
}

export default new SocketService();