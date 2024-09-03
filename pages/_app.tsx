import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      
        <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;