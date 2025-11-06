import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
// import {ClerkProvider} from "clerk/nextjs"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "GitSage",
  description: "All in one Git tool",
  icons: [{ rel: "icon", url: "/gitsage-logo.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>

    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster richColors/>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
