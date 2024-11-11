import {create} from "zustand";
import {AuthSlice, creatAuthslice} from "./auth/auth-slice.ts";
import {createSettingsSlice, SettingsSlice} from "./settings/setting-slice.ts";
import useTelegramAuthStore from "./telegram-slice.ts";
import createTelegramAuthStore from "./telegram-slice.ts";

type AppStore = AuthSlice & SettingsSlice
export const useAppStore = create<AppStore>()((...a) => ({
        ...creatAuthslice(...a),
        ...createTelegramAuthStore(...a)
}));