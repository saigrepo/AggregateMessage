import Login from "./pages/auth/Auth.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Auth from "./pages/auth/Auth.tsx";
import Message from "./pages/messages/Message.tsx";

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/auth" element={<Auth/>} />
            <Route path="/message" element={<Message/>} />
            <Route path="*" element={<Navigate to="/auth"/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
