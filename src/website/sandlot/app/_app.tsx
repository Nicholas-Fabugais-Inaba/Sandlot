import { AppProps } from 'next/app';
import { Providers } from './providers';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Providers session={session}>  {/* Pass session prop here */}
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
