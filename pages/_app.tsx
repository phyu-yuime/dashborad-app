import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import axios from "axios";

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