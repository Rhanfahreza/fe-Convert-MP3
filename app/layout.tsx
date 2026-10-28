import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audio Converter — YouTube & TikTok to MP3",
  description: "Ekstrak audio dari YouTube & TikTok berkualitas tinggi ke format MP3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-[#fafafa] min-h-screen selection:bg-zinc-800 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
