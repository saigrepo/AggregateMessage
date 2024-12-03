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
                    if(localStorage.getItem("telegramToken")!=null && !userInfo?.telegramId) {
                        const TeleResponse = await axios.get("http://localhost:5400/api/telegram-current-user");
                        setUserInfo({...resp?.data, telegramSessionString: localStorage.getItem("telegramToken"), telegramId:TeleResponse?.data.telegramId,telegramLoggedIn: true});
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
            return <Navigate to='/' />
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
            <Route path="/" element={
                <PrivateRoute><MainComponent /></PrivateRoute>
            } />
            <Route path="/profile_setup" element={
                <PrivateRoute><Profile/></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/auth"/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
