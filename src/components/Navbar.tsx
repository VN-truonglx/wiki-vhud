"use client";
import { usePathname } from 'next/navigation';
import Search from '@/components/Search';
import Link from 'next/link';
import { useState } from 'react'; // Thêm useState

export default function Navbar() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false); // Quản lý popup
  
  // Giả sử tạm thời: false là chưa đăng nhập, true là đã đăng nhập
  // Sau này bạn sẽ thay bằng: const { data: session } = useSession();
  const isLoggedIn = false; 

  const isEditPage = pathname?.includes('/post/edit');

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Chặn không cho nhảy sang trang /create
      setShowPopup(true); // Hiện thông báo
    }
  };

  return (
    <>
      <nav className={`w-full z-40 bg-white border-b transition-all ${
        isEditPage ? 'relative' : 'sticky top-0'
      }`}>
        {/* Bỏ bớt 1 thẻ <nav> dư thừa bên trong để tránh lỗi cấu hình sticky */}
        <div className="bg-white/50 backdrop-blur-md border-b border-blue-300">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo-homepage.png" alt="Wiki VHUD" className="h-11 w-auto" />
            </Link>
          
            <div className="flex items-center gap-4">
              <Search />
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/create" 
                onClick={handleCreateClick}
                className="inline-flex h-9 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              > 
                + Tạo bài viết 
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* POPUP THÔNG BÁO */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center scale-110 transition-all">
            <div className="text-blue-600 mb-4 flex justify-center">
              <img src="/logo-homepage.png" alt="Wiki VHUD" className="h-10 w-auto" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xin chào</h3>
            <p className="text-slate-600 mb-6">Đăng nhập trước cái đã nha?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => (window.location.href = '/login')} // Link đến trang login của bạn
                className="bg-blue-600 text-white py-2 rounded-full font-bold hover:bg-blue-700 transition"
              >
                OK nhé
              </button>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-slate-500 text-sm hover:underline"
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