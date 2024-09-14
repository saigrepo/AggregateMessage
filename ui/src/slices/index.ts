import {create} from "zustand";
import {AuthSlice, creatAuthslice} from "./auth/auth-slice.ts";
import {createSettingsSlice, SettingsSlice} from "./settings/setting-slice.ts";

type AppStore = AuthSlice & SettingsSlice
export const useAppStore = create<AppStore>()((...a) => ({
        ...creatAuthslice(...a),
        ...createSettingsSlice(...a)
}));