import type { Metadata } from "next";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import CustomLayout from "@/custom-layout/index";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Go Gym",
  description: "Get fit with Go Gym",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body>  
          <CustomLayout>
            {children}
          </CustomLayout>
          <Toaster
            position="top-center"
            
          />    
        </body>
      </html>
      
    </ClerkProvider>
  );
}

