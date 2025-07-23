import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Toaster } from "sonner";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document journey app",
  description:
    "Create agreements, collect e-signatures, and monitor every step with detailed audit logs — all in one platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookie();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardLayout user={user}>{children}</DashboardLayout>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: "bg-muted text-foreground",
            style: {
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
