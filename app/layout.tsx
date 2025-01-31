import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FormDataProvider } from "./context/FormDataContext";
import "leaflet/dist/leaflet.css";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Planner App",
  description: "Plan your perfect trip with our AI-powered travel planner.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FormDataProvider>{children}</FormDataProvider>
      </body>
    </html>
  );
}
