import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { Header } from '@/components/app/Header';
import { cn } from "@/lib/utils";

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
      <body className={cn(inter.className, "bg-background text-foreground transition-colors duration-300 ease-in-out")}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-background text-foreground p-4">
              <div className="container mx-auto text-center">
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
