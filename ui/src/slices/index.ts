import {create, SetState} from "zustand";
import {AuthSlice, creatAuthslice} from "./auth/auth-slice.ts";
import createTelegramAuthStore from "./telegram-slice.ts";

type AppStore = AuthSlice
export const useAppStore = create<AppStore>()((...a: ([Partial<AuthSlice>])) => ({
        ...creatAuthslice(...a),
        ...createTelegramAuthStore(...a)
}));