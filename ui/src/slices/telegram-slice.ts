interface TelegramAuthState {
    isLoggedIn: boolean;
    sessionString: string | null;
    setTelegramLogin: (session: string) => void;
    logoutTelegram: () => void;
}

const createTelegramAuthStore =  (set): TelegramAuthState => ({
    isLoggedIn: false,
    sessionString: null,
    setTelegramLogin: (session) => set({ isLoggedIn: true, sessionString: session }),
    logoutTelegram: () => set({ isLoggedIn: false, sessionString: null }),
});

export default createTelegramAuthStore;
