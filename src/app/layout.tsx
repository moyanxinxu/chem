import { StrictMode } from "react";
import { QueryProvider } from "@/component/provider";
import { Toaster } from "sonner";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <StrictMode>
      <html lang="zh-CN">
        <body className="h-screen w-screen flex">
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </StrictMode>
  );
}
