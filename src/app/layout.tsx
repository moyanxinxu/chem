import { StrictMode } from "react";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/provider";
import { RootLayoutProps } from "@/schema/common";
import "./globals.css";

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
