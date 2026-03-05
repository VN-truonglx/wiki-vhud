import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wiki VHUD",
  description: "Wiki vận hành ứng dụng",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-[#fffaf5] min-h-screen antialiased relative`}>

        {/* Bao bọc toàn bộ nội dung trong Providers */}
        <Providers>
          <Navbar />
          <Toaster
            position="top-center"
            expand={true}
            richColors={true}
            toastOptions={
              {
                style: {
                  width: 'fit-content',
                  borderRadius: '1.0rem',
                  padding: '16px 20px',
                  duration: 2500,
                },
              }
            }
          />
          <div
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{
              backgroundImage: `url('/patterns/seamless-bgr-img.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.025
            }}
          ></div>

          {children}

          {/* Badge Footer */}
          <div className="fixed bottom-6 left-6 z-50 pointer-events-none select-none">
            <div className="flex items-center gap-2 px-3 py-1.5 
                    bg-white/20 backdrop-blur-md 
                    border border-white/30 rounded-full 
                    shadow-lg shadow-black/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="text-[8px] font-bold tracking-widest uppercase text-slate-400/80 font-mono">
                @2026 VHUD <span className="text-sky-300">All right reserved.</span>
              </span>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}