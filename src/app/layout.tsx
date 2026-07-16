import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart HRMS AI | RedFoxa Careerlink",
  description: "HRMS Admin and Candidate portals for RedFoxa Careerlink",
  icons: {
    icon: "/favicon-redfoxa.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
