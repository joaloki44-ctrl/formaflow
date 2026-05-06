import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FormaFlow | Elite LMS Platform",
  description: "L'infrastructure pédagogique de nouvelle génération pour les créateurs qui redéfinissent leur industrie.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className={`${plusJakartaSans.variable} dark`}>
        <body className="font-sans antialiased bg-dark text-slate-400 min-h-screen relative selection:bg-secondary/30 selection:text-white">
          <div className="mesh-bg opacity-40" />
          <Header />
          <main className="relative z-0 min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
              }
            }}
          />
          <ServiceWorkerRegistration />
        </body>
      </html>
    </ClerkProvider>
  );
}
