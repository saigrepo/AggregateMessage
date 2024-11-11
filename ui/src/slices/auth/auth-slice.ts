export interface AuthSlice {
    userInfo: undefined;
    setUserInfo: (userInfo: (prevState) => void) => void;
}

export const creatAuthslice = (set): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo)=>set({userInfo}),
});