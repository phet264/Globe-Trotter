import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  description: "Plan, visualize, and share your multi-city journeys with GlobeTrotter.",
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

          {/* Footer Placeholder */}
          <footer className="border-t border-border/40 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <span className="font-display text-xl font-bold">GlobeTrotter</span>
                <p className="mt-4 text-sm text-muted-foreground">Premium travel planning for the modern explorer.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Features</li>
                  <li>Pricing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>About</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
