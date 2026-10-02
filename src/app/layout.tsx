import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/context/AuthContext";
import BrandIntroLoader from "@/components/common/BrandIntroLoader";
import DesktopSidebar from "@/components/layout/DesktopSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Travally — Social Travel Companion & Activity Discovery",
  description:
    "Connect with verified travel companions based on shared everyday activities, cafes, movies, local exploration, and upcoming travel expeditions. Mutual approval, transparent compatibility, and private chat.",
  keywords: [
    "travally",
    "travel companion",
    "social companion",
    "travel partner",
    "activity buddy",
    "travel companion app",
    "movie companion",
    "explore companion",
  ],
  authors: [{ name: "Travally Platform" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://travally.in"),
  openGraph: {
    title: "Travally — Social Travel Companion & Discovery",
    description:
      "Find genuine companions for everyday activities and upcoming travel with mutual approval and transparent compatibility.",
    url: "https://travally.in",
    siteName: "Travally",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travally — Social Travel Companion Platform",
    description:
      "Find companions for everyday activities and travel adventures with mutual approval and safe coordination.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enforce light mode only
              document.documentElement.classList.remove('dark');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-[#f8fafc] dark:bg-[#090d0b] text-slate-900 dark:text-slate-100`}>
        <ThemeProvider>
          <AuthProvider initialUser={currentUser}>
            <BrandIntroLoader />
            <Navbar initialUser={currentUser} />
            <div className="flex-1 flex min-w-0">
              <DesktopSidebar initialUser={currentUser} />
              <main className="flex-1 min-w-0">{children}</main>
            </div>
            <Footer initialUser={currentUser} />
            <BottomNav initialUser={currentUser} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

