import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import {AuthContextProvider} from "@/contexts/authContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;


}>) {

    return (
    <html lang="en">
      <body>
          <AppWalletProvider>
              {children}
          </AppWalletProvider>
      </body>
    </html>
  );
}
