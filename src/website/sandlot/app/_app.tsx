// app/_app.tsx

import { AppProps } from "next/app";
import { Providers } from "./providers";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Providers session={session}>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
