/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SPRING_SERVER_URL: string;
    VITE_SPRING_SOCKET_URL: string;
    // Add other VITE_ prefixed variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}