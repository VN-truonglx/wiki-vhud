"use client";
import { useState } from "react";
import { Menu, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostAdminMenu({ postId }: { postId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác!")) {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Đã xóa bài viết");
        router.push("/"); // Xóa xong quay về trang chủ
        router.refresh();
      } else {
        alert("Có lỗi xảy ra khi xóa");
      }
    }
  };

  return (
    <div className="relative">
      {/* Nút tròn Menu 3 gạch */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <Link 
            href={`/post/edit/${postId}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil size={16} /> Sửa bài viết
          </Link>
          <button 
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
          >
            <Trash2 size={16} /> Xóa bài viết
          </button>
        </div>
      )}
    </div>
  );
}