"use client";
import { usePathname } from 'next/navigation';
import Search from '@/components/Search';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react"; // Import Headless UI
import { LogOut, User as UserIcon, ChevronDown, Settings } from "lucide-react"; // Thêm icon cần thiết

export default function Navbar() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  
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
      setShowPopup(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      <nav className={`w-full z-40 bg-white/10 border-b backdrop-blur-md transition-all ${
        isEditPage ? 'relative' : 'sticky top-0'
      }`}>
        <div className="bg-white/50 border-b border-blue-300">
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
              <Link 
                href="/create" 
                onClick={handleCreateClick}
                className="inline-flex h-9 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              > 
                + Tạo bài viết 
              </Link>

              {isLoggedIn ? (
                /* --- DROPDOWN MENU VỚI HEADLESS UI --- */
                <Menu as="div" className="relative inline-block text-left border-l pl-3 border-slate-200">
                  <Menu.Button className="flex items-center gap-2 hover:bg-slate-100/50 p-1 pr-2 rounded-full transition-all outline-none group">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-sm font-bold text-slate-800 leading-none">
                        {session?.user?.name || "Đồng nghiệp <3"}
                      </span>
                      <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                        {(session?.user as any)?.role || "USER"}
                      </span>
                    </div>
                    
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
                      {session?.user?.name ? session.user.name[0].toUpperCase() : <UserIcon size={16}/>}
                    </div>

                    {/* Icon mũi tên thay cho nút Logout cũ */}
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right divide-y divide-slate-100 rounded-[1rem] bg-white shadow-2xl focus:outline-none p-2 z-50">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={`${
                                active ? "bg-blue-50 text-blue-600" : "text-slate-700"
                              } group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors`}
                            >
                              <UserIcon size={18} strokeWidth={2.5} />
                              Quản lý cá nhân
                            </Link>
                          )}
                        </Menu.Item>
                      </div>

                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className={`${
                                active ? "bg-red-50 text-red-600" : "text-slate-600"
                              } group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors`}
                            >
                              <LogOut size={18} strokeWidth={2.5} />
                              Đăng xuất
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
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

      {/* POPUP THÔNG BÁO */}
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