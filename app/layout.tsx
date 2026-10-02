import type { Metadata } from "next";
import "./globals.css";
import { StudioSessionProvider } from "@/components/auth/studio-session";

export const metadata: Metadata = {
  title: "JerseyOS | AI-Powered Jersey Production OS",
  description: "AI-Powered Full Operating System for Jersey Production",
  applicationName: "JerseyOS",
  icons: {
    icon: "/brand/jerseyos-logo.svg",
    shortcut: "/brand/jerseyos-logo.svg",
    apple: "/brand/jerseyos-logo.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StudioSessionProvider>{children}</StudioSessionProvider>
      </body>
    </html>
  );
}
