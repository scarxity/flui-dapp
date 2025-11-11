import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import Providers from "@/app/providers";
import Navbar from "@/components/Navbar";

const rogan = localFont({
  src: [
    {
      path: "../../public/fonts/rogan/Rogan-Thin-BF654c4a949df4e.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-ThinItalic-BF654c4a94612bf.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-ExtraLight-BF654c4a93ce770.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-ExtraLightItalic-BF654c4a9547263.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-Light-BF654c4a94a942a.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-LightItalic-BF654c4a949b962.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-Regular-BF654c4a9481d1b.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-RegularItalic-BF654c4a94a2190.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-Medium-BF654c4a941b3cb.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-MediumItalic-BF654c4a94eeadc.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-SemiBold-BF654c4a94a3244.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-SemiBoldItalic-BF654c4a9490da9.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-Bold-BF654c4a94709f5.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-BoldItalic-BF654c4a9461b6a.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/rogan/Rogan-ExtraBold-BF654c4a9347341.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/rogan/Rogan-ExtraBoldItalic-BF654c4a9489f02.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-rogan",
});

export const metadata: Metadata = {
  title: {
    default: "Nextjs Starter Template",
    template: "%s | Nextjs Starter Template",
  },
  description: "Nextjs 14.2.1 + Tailwind CSS starter template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rogan.className}>
        <Providers>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: "",
              duration: 3000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
