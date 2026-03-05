"use client";
import { useState, Fragment } from "react";
import { Menu as LucideMenu, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";

export default function PostAdminMenu({ postId }: { postId: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý Modal xác nhận
  const router = useRouter();

  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setIsModalOpen(false);
        // Toast Success mặc định của Sonner giờ sẽ tự động đẹp
        toast.success("Xóa bài viết thành công!", {
          description: "Đang chuyển hướng về trang chủ...",
        });
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        toast.error("Không thể xóa bài viết này");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div className="relative">
      {/* NÚT MỞ MENU TRÒN */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
      >
        {isMenuOpen ? <X size={20} /> : <LucideMenu size={20} />}
      </button>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)} // Click ra ngoài sẽ đóng menu
        />
      )}

      {/* DROPDOWN MENU */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <Link
            href={`/post/edit/${postId}`}
            className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil size={18} /> Sửa bài viết
          </Link>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
          >
            <Trash2 size={18} /> Xóa bài viết
          </button>
        </div>
      )}

      {/* HEADLESS UI MODAL XÁC NHẬN */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={() => setIsModalOpen(false)}>
          {/* Lớp nền mờ */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[400px] transform overflow-hidden rounded-[2.5rem] bg-white p-10 text-center align-middle shadow-2xl transition-all relative">
                  {/* Nút X đóng Modal */}
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 size={40} />
                  </div>

                  <Dialog.Title as="h3" className="text-2xl font-semibold text-slate-900 mb-2">
                    Xác nhận xóa bài
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-slate-500 mb-8 px-4 leading-relaxed">
                      Bay màu mất tiêu luôn đó?
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={executeDelete}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
                    >
                      Đồng ý, xóa ngay
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                    >
                      Quay lại
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}