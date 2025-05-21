import "@/styles/globals.css";
import type { AppProps } from 'next/app';
import Head from "next/head";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>

                <title>Memo-App</title>
                <meta name="description" content="A simple Next.js application" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}