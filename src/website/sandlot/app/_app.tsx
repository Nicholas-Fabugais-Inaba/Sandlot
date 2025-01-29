import { AppProps } from 'next/app';
import { Providers } from './providers';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;