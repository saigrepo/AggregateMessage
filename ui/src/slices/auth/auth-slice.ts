export interface AuthSlice {
    userInfo: any;
    setUserInfo: (userInfo: (prevState) => void) => void;
}

export const creatAuthslice = (set): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo)=>set({userInfo}),
});