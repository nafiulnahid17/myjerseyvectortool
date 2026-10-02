import type { Metadata } from "next";
import "./globals.css";
import { StudioSessionProvider } from "@/components/auth/studio-session";

export const metadata: Metadata = {
  title: "My Jersey Studio — Production Workspace",
  description: "Convert jersey photographs into flat production panels, trace editable vectors, add names and logos, and export to SVG, PDF or PNG.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
