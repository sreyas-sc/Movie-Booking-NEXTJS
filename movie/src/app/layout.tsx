
'use client'

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from './components/header';
import { Provider } from 'react-redux'; // Import only Provider
import { store } from "./store/index";
import ClientProvider from "./components/ClientProvider"; // Import ClientProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

// Load fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}> {/* Wrapping the entire app with Provider */}
        <GoogleOAuthProvider clientId="987227929104-pru0bngolrtgunsqegcghp10em6mj9vb.apps.googleusercontent.com">
          <Header /> {/* Header present on every page */}
          <ClientProvider> {/* Logic inside ClientProvider */}
            <main style={{ marginTop: '64px' }}>
              {children}
            </main>
          </ClientProvider>
          </GoogleOAuthProvider>;
        </Provider>
      </body>
    </html>
  );
}
