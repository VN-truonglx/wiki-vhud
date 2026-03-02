"use client";
import { usePathname } from 'next/navigation';
import Search from '@/components/Search';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSession, signOut } from "next-auth/react"; // Import hook của NextAuth
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  
  // Lấy dữ liệu phiên đăng nhập thực tế
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const isEditPage = pathname?.includes('/post/edit');

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowPopup(true);
    }
  };

  useEffect(() => {
  if (isLoggedIn) {
    setShowPopup(false); // Nếu đã login thành công thì không bao giờ hiện popup
  }
}, [isLoggedIn]);

  return (
    <>
      <nav className={`w-full z-40 bg-white border-b transition-all ${
        isEditPage ? 'relative' : 'sticky top-0'
      }`}>
        <div className="bg-white/50 backdrop-blur-md border-b border-blue-300">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo-homepage.png" alt="Wiki VHUD" className="h-11 w-auto" />
            </Link>
          
            {/* Thanh tìm kiếm */}
            <div className="flex items-center gap-4">
              <Search />
            </div>

            {/* Khối User & Hành động */}
            <div className="flex items-center gap-4">
              {/* Nút tạo bài viết (chỉ hiện popup nếu chưa login) */}
              <Link 
                href="/create" 
                onClick={handleCreateClick}
                className="inline-flex h-9 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              > 
                + Tạo bài viết 
              </Link>

              {/* Hiển thị Thông tin User sau khi đăng nhập */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2 border-l pl-3 border-slate-200">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-bold text-slate-800 leading-none">
                      {session?.user?.name || "Đồng nghiệp <3"}
                    </span>
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                      {(session?.user as any)?.role || "USER"}
                    </span>
                  </div>
                  
                  {/* Avatar tròn với chữ cái đầu của tên */}
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
                    {session?.user?.name ? session.user.name[0].toUpperCase() : <UserIcon size={16}/>}
                  </div>

                  {/* Nút Đăng xuất */}
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* POPUP THÔNG BÁO (Giữ nguyên logic cũ của bạn) */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <img src="/logo-homepage.png" alt="Wiki VHUD" className="h-10 w-auto" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">Dừng lại một chút!</h3>
            <p className="text-slate-500 mb-6 font-medium">Đăng nhập cái đã nha?</p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/login"
                onClick={() => setShowPopup(false)}
                className="bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                OK nhé
              </Link>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-slate-400 text-sm font-bold hover:text-slate-600 transition"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}