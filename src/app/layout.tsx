import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AppWalletProvider>{children}</AppWalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
