import type { Metadata } from "next";
import "./globals.css";
import { StudioSessionProvider } from "@/components/auth/studio-session";
import { GlobalJerseyOSNavigation } from "@/components/navigation/global-jerseyos-navigation";

export const metadata: Metadata = {
  title: "JerseyOS | AI-Powered Jersey Production OS",
  description: "AI-Powered Full Operating System for Jersey Production",
  applicationName: "JerseyOS",
  icons: {
    icon: "/brand/jerseyos-logo.png",
    shortcut: "/brand/jerseyos-logo.png",
    apple: "/brand/jerseyos-logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mj-theme="light">
      <body className="antialiased">
        <StudioSessionProvider>
          <GlobalJerseyOSNavigation />
          {children}
        </StudioSessionProvider>
      </body>
    </html>
  );
}
