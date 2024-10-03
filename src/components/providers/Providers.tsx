import { ThemeProvider } from "../themes/theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import NextAuthProvider from "./NextAuthProvider";
import { CSPostHogProvider } from "./PostHogProvider";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CSPostHogProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider delayDuration={300}>
          <QueryProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </QueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </CSPostHogProvider>
  );
}
