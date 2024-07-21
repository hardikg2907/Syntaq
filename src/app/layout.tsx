import "~/styles/globals.css";
import { ThemeProvider } from "~/components/themes/theme-provider";

import { Inter as FontSans } from "next/font/google";

import { type Metadata } from "next";
import { cn } from "~/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Syntaq",
  description: "Manage your hackathons with ease.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body
            className={cn(
              "min-h-screen w-full bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            <Navbar />
            <main className="min-h-screen w-full bg-slate-100 p-3 text-slate-950 dark:bg-black dark:text-white">
              {children}
            </main>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
