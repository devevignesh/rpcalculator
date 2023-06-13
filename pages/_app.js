import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <ErrorBoundary fallback={<div>We apologize for the inconvenience. Please try again later.</div>}>
                <Component {...pageProps} />
            </ErrorBoundary>
            <Analytics />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
        </>
    );
}

export default MyApp;
