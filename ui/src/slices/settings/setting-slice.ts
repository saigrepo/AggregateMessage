
export interface SettingsSlice {
    darkMode: boolean;
    toggleDarkMode: (darkMode) => void;
}
export const createSettingsSlice = (set): SettingsSlice => <SettingsSlice>({
    darkMode: false,
    toggleDarkMode: (darkMode) => set(({darkMode})),
});