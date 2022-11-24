import React, { useEffect } from 'react'
import { io, Socket } from 'socket.io-client';

export default function useWebsocket({ url }: { url: string }) {
    const [socket, setSocket] = React.useState<Socket | null>(null);

    useEffect(() => {
        const socket = io(url);

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, []);

    return socket;
}
