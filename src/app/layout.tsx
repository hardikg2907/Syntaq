import "~/styles/globals.css";
import { ThemeProvider } from "~/components/themes/theme-provider";

import { Inter as FontSans } from "next/font/google";

import { type Metadata } from "next";
import { cn } from "~/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";
import { Toaster } from "~/components/ui/sonner";
import NextAuthProvider from "~/components/NextAuthProvider";

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
            <NextAuthProvider>
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <Navbar />
              <main className="min-h-screen w-full bg-slate-100 p-3 text-slate-950 dark:bg-black dark:text-white">
                {children}
              </main>
              <Toaster />
            </NextAuthProvider>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
