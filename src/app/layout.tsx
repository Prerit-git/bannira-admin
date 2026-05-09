import "./globals.css";
import type { Metadata } from "next";
import ManagementLayout from "@/components/ManagementLayout";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6]">
        <AuthProvider>
        <ManagementLayout>
          {children}
        </ManagementLayout>
        </AuthProvider>
      </body>
    </html>
  );
}