import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  const { session, ...otherProps } = pageProps as any;
  return (
    <SessionProvider session={session}>
      <Component {...otherProps} />
    </SessionProvider>
  );
}

export default MyApp;
