import "./globals.css";
import type { Metadata } from "next";
import ManagementLayout from "@/components/ManagementLayout";

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
        <ManagementLayout>
          {children}
        </ManagementLayout>
      </body>
    </html>
  );
}