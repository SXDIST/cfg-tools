import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cfg-tools",
  description: "Desktop DayZ config generator",
};

const isDev = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = isDev
  ? [
      "default-src 'self' data: blob: http://localhost:3000 ws://localhost:3000 https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "connect-src 'self' data: blob: http://localhost:3000 ws://localhost:3000 https://api.github.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' data: https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
    ].join("; ")
  : [
      "default-src 'self' data: blob: https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "connect-src 'self' https://api.github.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' data: https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={contentSecurityPolicy}
        />
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
