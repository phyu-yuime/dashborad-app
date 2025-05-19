// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EyeOff } from "lucide-react"; // Optional icon

export default function App({ Component, pageProps }: AppProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [showDeveloperTools, setShowDeveloperTools] = useState(true);

    // Check sessionStorage on first render
    useEffect(() => {
        const hide = sessionStorage.getItem("hideDeveloperTools");
        if (hide === "true") {
            setShowDeveloperTools(false);
        }

        // Example API call
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/`, {
                withCredentials: true,
            })
            .then((response) => {
                setDate(response.data); // replace or use as needed
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, []);

    const handleHideDevTools = () => {
        sessionStorage.setItem("hideDeveloperTools", "true");
        setShowDeveloperTools(false);
    };

    return (
        <div className="App">
            <Component {...pageProps} />
            {process.env.NODE_ENV === "development" && showDeveloperTools && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
                    <p className="mb-2 text-sm font-medium">Developer Tools Active</p>
                    <button
                        onClick={handleHideDevTools}
                        className="flex items-center gap-2 text-sm hover:opacity-80"
                    >
                        <EyeOff size={16} />
                        Hide Dev Tools for This Session
                    </button>
                </div>
            )}
        </div>
    );
}
