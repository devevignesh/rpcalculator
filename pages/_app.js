import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
        </>
    );
}

export default MyApp;
