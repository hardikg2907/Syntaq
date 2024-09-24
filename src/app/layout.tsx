import { ThemeProvider } from "~/components/themes/theme-provider";
import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { extractRouterConfig } from "uploadthing/server";
import Navbar from "~/components/navbar/navbar";
import { cn } from "~/lib/utils";

import { QueryClient } from "@tanstack/react-query";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import NextAuthProvider from "~/components/providers/NextAuthProvider";
import QueryProvider from "~/components/providers/QueryProvider";
import { Toaster } from "~/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Syntaq",
  description: "Manage your hackathons with ease.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// axios.interceptors.response.use(
//   null,
//   (error) => {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.message;
//       const statusCode = error.response?.status;
//       if (statusCode && statusCode >= 400 && statusCode < 500) {
//         toast.error(errorMessage);
//       }
//     }
//   },
//   { synchronous: true },
// );

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="flex min-h-full flex-col scroll-smooth"
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body
          className={cn(
            "flex flex-grow flex-col bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <QueryProvider>
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
              <main className="w-full flex-grow bg-slate-100 p-3 text-slate-950 dark:bg-black dark:text-white">
                {children}
              </main>
              <Toaster richColors />
            </NextAuthProvider>
          </QueryProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
