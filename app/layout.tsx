import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jazzy Song Generator",
  description: "Procedurally generate and play a jazzy tune",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
