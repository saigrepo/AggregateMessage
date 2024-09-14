import Login from "./pages/auth/Auth.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Auth from "./pages/auth/Auth.tsx";
import Message from "./pages/messages/Message.tsx";
import {useAppStore} from "./slices";
import {useEffect, useState} from "react";
import apiClient from "./lib/api-client.ts";
import {CURRENT_USER_ROUTE} from "./utils/Constants.ts";
import Profile from "./pages/profile/Profile.tsx";
import {SocketProvider} from "./context/socket.tsx";
import CreateChatRoom from "./pages/messages/chat-container/CreateChatRoom.tsx";

function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect( ()=> {
        const getUserData = async () => {
            try {
                const resp = await apiClient.get(CURRENT_USER_ROUTE, {withCredentials: true});
                if(resp.status==200 && resp.data.userId) {
                    setUserInfo(resp.data);
                } else {
                    setUserInfo(undefined);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }

        if(!userInfo) {
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
        const authed = !!userInfo;
        return authed ?  <Navigate to='/MessageComponent' /> : children;
    };

  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/auth" element={
                <AuthedRoute><Auth/></AuthedRoute>
            } />
            <Route path="/MessageComponent" element={
                <PrivateRoute><Message/></PrivateRoute>
            } />
            <Route path="/profile" element={
                <PrivateRoute><Profile/></PrivateRoute>
            } />
            <Route path="/createChatRoom" element={
                <PrivateRoute><CreateChatRoom/></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/auth"/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
