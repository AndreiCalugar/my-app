import { FormDataProvider } from "./context/FormDataContext";

import "./globals.css";

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
