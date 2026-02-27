import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
// import Link from 'next/link';
// import Search from '@/components/Search';


const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VHUD",
  description: "Wiki vận hành ứng dụng",
  icons: {
    icon: "/favicon.ico"
  }
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-[#fffaf5] min-h-screen antialiased relative`}>
        <Navbar />
        <div
          className="fixed inset-0 z-[-1] pointer-events-none"
          style={{
            backgroundImage: `url('/patterns/seamless-bgr-img.svg')`,
            backgroundSize: 'cover',        // Ảnh bao phủ toàn màn hình
            backgroundPosition: 'center',   // Căn giữa ảnh
            backgroundRepeat: 'no-repeat',  // Không lặp lại
            opacity: 0.025                  // ĐỂ RẤT MỜ (0.03 - 0.05) để không đè chữ
          }}
        ></div>

        
        {children}
        {/* <div className="fixed bottom-4 left-4 z-50 pointer-events-none select-none opacity-30 font-mono text-xs text-slate-500 italic">
          @2026 EVF. All rights reserved.
        </div> */}
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none select-none">
          <div className="flex items-center gap-2 px-3 py-1.5 
                  bg-white/20 backdrop-blur-md 
                  border border-white/30 rounded-full 
                  shadow-lg shadow-black/5">
            {/* Một cái chấm xanh nhỏ tạo cảm giác "Live" hoặc "Active" */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>

            <span className="text-[8px] font-bold tracking-widest uppercase text-slate-400/80 font-mono">
              @2026 VHUD <span className="text-sky-300">All right reserved.</span>
            </span>
          </div>
        </div>
      </body>
    </html>
  )
}
