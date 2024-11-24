import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        fetch("/api/socket"); // Initialize the WebSocket server
    }, []);

  return <Component {...pageProps} />;
}
