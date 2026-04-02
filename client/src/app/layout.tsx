import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebVerse",
  description: "Enter the Multiverse of the Web",
  icons: {
    icon: "/spider.png",
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
        {children}
      </body>
    </html>
  );
}
