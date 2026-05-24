import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NavigationDrawer } from "@/components/layout/NavigationDrawer";
import { MainContent } from "@/components/layout/MainContent";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon Dashboard | Hanaloop",
  description: "PCF 탄소 발자국 계산 및 시각화 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-slate-50 text-slate-900">
        <div className="flex h-full">
          <NavigationDrawer />
          <MainContent>{children}</MainContent>
        </div>
      </body>
    </html>
  );
}
