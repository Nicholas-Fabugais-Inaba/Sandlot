// app/_app.tsx

import { AppProps } from 'next/app';
import { Providers } from './providers';
import { SessionProvider } from 'next-auth/react'; // Ensure this import is here
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>  {/* Pass session prop here */}
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </SessionProvider>
  );
}

export default MyApp;
