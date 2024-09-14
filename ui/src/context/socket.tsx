import { createContext, useContext, useEffect, useRef, useState } from "react";
import {SOCKET_HOST_ROUTE} from "../utils/Constants.ts";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const url = SOCKET_HOST_ROUTE; // Your WebSocket endpoint

    return (
        <StompProvider url={url} debug={true}>
            {children}
        </StompProvider>
    );
}