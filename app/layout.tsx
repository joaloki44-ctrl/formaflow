import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "FormaFlow - Créez votre formation en 1h",
  description: "Plateforme LMS 100% Française. Créez, vendez et gérez vos formations en ligne avec un éditeur intuitif, IA intégrée et conformité Qualiopi.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ff6b4a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className="font-sans antialiased bg-[#faf9f6]">
          <Header />
          {children}
          <Footer />
          <Toaster position="bottom-right" />
          <ServiceWorkerRegistration />
        </body>
      </html>
    </ClerkProvider>
  );
}
