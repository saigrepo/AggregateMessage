import {Provider} from "react-redux";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Toaster} from "./components/ui/sonner.tsx";
import {store} from "./redux/Store.ts";

createRoot(document.getElementById('root')!).render(
    <>
        <Provider store={store}>
            <App />
            <Toaster closeButton />
        </Provider>
    </>,
)
