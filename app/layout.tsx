import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://treasure-hunt-rho-nine.vercel.app'),
  title: "Hatim Technologies",
  description: "A project by Hatim Technologies - https://hatimtechnologies.in",
  icons: {
    icon: "/logo.ico",
    apple: "/logo.ico",
    shortcut: "/logo.ico"
  },
  openGraph: {
    title: "Hatim Technologies",
    description: "A project by Hatim Technologies - https://hatimtechnologies.in",
    images: [
      {
        url: "/logo2.jpeg",
        width: 1200,
        height: 630,
        alt: "Hatim Technologies",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hatim Technologies",
    description: "A project by Hatim Technologies - https://hatimtechnologies.in",
    images: ["/logo2.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
