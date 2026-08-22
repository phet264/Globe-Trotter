import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "GlobeTrotter | Premium Travel Planning",
  description: "Plan, visualize, and share your multi-city journeys with GlobeTrotter. Experience your trip in 3D before you travel.",
  openGraph: {
    title: "GlobeTrotter | Premium Travel Planning",
    description: "Design your perfect journey with our premium travel planning tools.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
