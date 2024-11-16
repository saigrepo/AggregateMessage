import Auth from "./pages/auth/Auth.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import MainComponent from "./pages/messages/Main.tsx";
import {useAppStore} from "./slices";
import {useEffect, useState} from "react";
import apiClient from "./lib/api-client.ts";
import {CURRENT_USER_ROUTE} from "./utils/Constants.ts";
import Profile from "./pages/profile/Profile.tsx";
import axios from "axios";

function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect( ()=> {
        const getUserData = async () => {
            try {
                const resp = await apiClient.get(CURRENT_USER_ROUTE, {withCredentials: true});
                if(resp.status==200 && resp.data.userId) {
                    if(localStorage.getItem("telegramToken")!=null) {
                        console.log(userInfo);
                        const emailId = resp.data.userEmail;
                        const teleResponse = await fetch("http://localhost:5400/api/telegram-get-user", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                emailId
                            })
                        });
                        const resData = await teleResponse.json();
                        setUserInfo({...resp?.data, telegramSessionString: localStorage.getItem("telegramToken"), telegramId:resData?.telegramId, phoneNumber: resData?.phoneNumber, telegramLoggedIn: true});
                    } else {
                        setUserInfo(resp.data);
                    }
                } else {
                    setUserInfo(undefined);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }

        if(!userInfo && localStorage.getItem("jwtToken")!=null) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [userInfo, setUserInfo])

    if(loading) {
        return <div>Loading ...</div>
    }

    const PrivateRoute = ({ children})=> {
        const { userInfo } = useAppStore();
        const authed = !!userInfo;
        return authed ? children : <Navigate to='/auth' />;
    };

    const AuthedRoute = ({ children})=> {
        const { userInfo } = useAppStore();
        const authed = !!userInfo && !!localStorage.getItem("jwtToken");
        if(authed) {
            if(!userInfo?.userProfileCreated) {
                return <Navigate to='/profile' />
            }
            return <Navigate to='/MainComponent' />
        }
        return children;
    };

  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/auth" element={
                <AuthedRoute><Auth/></AuthedRoute>
            } />
            <Route path="/MainComponent" element={
                <PrivateRoute><MainComponent /></PrivateRoute>
            } />
            <Route path="/profile" element={
                <PrivateRoute><Profile/></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/auth"/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
