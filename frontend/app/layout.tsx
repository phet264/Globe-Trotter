import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
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
        <TooltipProvider>
          {/* Header Placeholder */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex gap-2 items-center">
                <span className="font-display text-2xl font-bold tracking-tight">GlobeTrotter</span>
              </div>
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Explore</span>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Trips</span>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Dashboard</span>
              </nav>
              <div className="flex items-center gap-4">
                <button className="text-sm font-medium hover:underline underline-offset-4">Sign In</button>
                <button className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Start Planning
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col">{children}</main>

          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
