"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { updatePost } from "@/lib/actions";
import TiptapEditor from "@/components/TiptapEditor";
import { toast } from 'sonner';

type Access = "PUBLIC" | "INTERNAL";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = parseInt(params.id as string);

  const [post, setPost] = useState<any>(null);
  const [access, setAccess] = useState<Access>("PUBLIC");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef('');

  // Flag quan trọng: Ngăn chặn fetch lặp vô tận gây treo máy
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    const fetchPost = async () => {
      // Nếu đã đang fetch hoặc đã fetch xong thì không chạy lại nữa
      if (fetchedRef.current) return;

      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy bài viết");

        const data = await res.json();

        // Kiểm tra quyền: Luôn ép kiểu String để tránh lỗi lệch kiểu ID
        const currentUserId = session?.user?.id;
        const isAuthor = currentUserId && String(data.authorId) === String(currentUserId);
        const isAdmin = session?.user?.role === "ADMIN";

        if (!isAuthor && !isAdmin) {
          toast.warning("Không được sửa bài!",{
            description: 'Bạn không phải tác giả',
            style: { borderRadius: '1.5rem' },
          });
          router.push(`/post/${id}`);
          return;
        }

        setPost(data);
        setAccess(data.access || "PUBLIC");
        contentRef.current = data.content;
        fetchedRef.current = true; // Đánh dấu đã fetch thành công
      } catch (error) {
        console.error("Error fetching post:", error);
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };

    fetchPost();
  }, [id, status]);

  const handleUpdate = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      formData.set("content", contentRef.current);
      formData.set("access", access);
      await updatePost(id, formData);
      toast.success("Cập nhật thành công!", {
        description: 'Bài viết của bạn đã được lưu vào Wiki.',
        style: { borderRadius: '1.5rem' },
      });
      router.push(`/post/${id}`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật!", {
        description: 'Vui lòng thử lại sau',
        style: { borderRadius: '1.5rem' }, 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI khi đang chờ kiểm tra quyền
  if (status === "loading" || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-2 md:p-8">
      <h1 className="text-2xl text-blue-700 font-bold mb-4">Bạn đang sửa bài viết:</h1>
      <form action={handleUpdate} className="space-y-7">
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            defaultValue={post?.title}
            className="text-3xl md:text-4xl font-black w-full outline-none border-b border-transparent focus:border-blue-200 transition-colors"
            placeholder="Nhập tiêu đề..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Hashtag</label>
            <input
              type="text"
              name="hashtag"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              defaultValue={post?.hashtag}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Tác giả</label>
            <input
              type="text"
              value={post?.author?.name || "Ẩn danh"}
              disabled
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-400 cursor-not-allowed font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Chế độ</label>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as Access)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="PUBLIC">Công khai</option>
              <option value="INTERNAL">Nội bộ</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nội dung</label>
          {/* Truyền content vào Editor */}
          {post && (
            <TiptapEditor
              initialContent={post.content}
              onChange={(html) => (contentRef.current = html)}
            />
          )}
        </div>

        <div className="flex items-center gap-4 pt-1 rounded-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-blue-300"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 rounded-full font-bold text-slate-500 hover:bg-orange-300 text-orange-400 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </main>
  );
}