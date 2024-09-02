import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { Header } from '@/components/app/Header';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'SpellSphere',
  description: 'Your magical AI assistant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
            <Header />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <footer className="bg-accent-color text-bg-primary p-4">
              <div className="container mx-auto">
                <p>&copy; 2023 SpellSphere. All rights reserved.</p>
                <p>Empowering language learning through technology</p>
                <p>Contact: support@spellsphere.com</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
