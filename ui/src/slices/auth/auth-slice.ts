export interface AuthSlice {
    userInfo: undefined;
    setUserInfo: (userInfo: AuthSlice['userInfo']) => void;
}

export const creatAuthslice = (set): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo)=>set({userInfo}),
});