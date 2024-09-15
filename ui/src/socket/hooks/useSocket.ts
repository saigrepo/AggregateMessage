import { useCallback, useEffect, useState } from "react";
import io from 'socket.io-client'
import {SOCKET_HOST} from "../../utils/Constants.ts";
import {toast} from "sonner";

export const useSocket = (room, username) => {
    const [socket, setSocket] = useState(null);
    const [socketResponse, setSocketResponse] = useState({
        room: "",
        message: "",
        username: "",
        messageType:"",
        createdAt: ""
    });
    const [isConnected, setConnected] = useState(false);

    const sendData = useCallback((payload) => {
        socket.emit("send_message", {
            room: room,
            message: payload.message,
            username: username,
            messageType: "CLIENT"
        });
    }, [socket, room]);

    useEffect(() => {
        const s = io(SOCKET_HOST, {
            transports: ['websocket'],
            query: `username=${username}&room=${room}`,
            forceNew: true, // Force a new connection
            upgrade: false, // Disable HTTP long-polling
            allowEIO3: true
        });
        setSocket(s);
        s.on("connect", () => {
            console.log("connected to socket");
            toast.success("connected to socket");
            setConnected(true);
        });
        s.on("connect_error", (error) => {
            console.error("SOCKET CONNECTION ERROR", error);
        });
        s.on("read_message", (res) => {
            setSocketResponse({
                room: res.room,
                message: res.message,
                username: res.username,
                messageType: res.messageType,
                createdAt: res.createdAt
            });
        });

        return () => {
            s.disconnect();
        };
    }, [room, username]);

    return { isConnected, socketResponse, sendData };
}