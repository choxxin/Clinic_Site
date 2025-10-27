import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TermsAndConditionsModal from "@/components/TermsAndConditionsModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clinic Management System",
  description: "Comprehensive clinic management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TermsAndConditionsModal />
        {children}
      </body>
    </html>
  );
}
