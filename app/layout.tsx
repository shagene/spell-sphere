import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SpellSphere',
  description: 'Your magical AI assistant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-bg-primary text-text-primary min-h-screen flex flex-col`}>
        <Providers>
          <main className="flex-grow p-4">
            {children}
          </main>
          <footer className="bg-accent-color text-bg-primary p-4 mt-8">
            <div className="container mx-auto">
              <p>&copy; 2023 SpellSphere. All rights reserved.</p>
              <p>Empowering language learning through technology</p>
              <p>Contact: support@spellsphere.com</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
