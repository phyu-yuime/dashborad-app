import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import axios from "axios";

declare global {
    interface Window {
        __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    }
}

// React DevTools を無効化
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Disable React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ as any)[prop] = typeof Function;
        }
    }
}

export default function App({ Component, pageProps }: AppProps) {
    const [date, setDate] = useState<Date>(new Date());
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/auth/", {
                withCredentials: true,
            })
            .then((response) => {
                setDate(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, []);
    return (
        <div className="App">
            <div>
                <Component {...pageProps} />
            </div>
        </div>
    );
}