import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import '../app/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default MyApp;