"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { updateProfile, getMyPosts } from "@/lib/actions";
import { toast } from "sonner"; // Dùng sonner để đồng bộ giao diện [cite: 3]
type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  thumbnail: string | null;
  hashtag: string | null;
  createdAt: Date;
  updatedAt: Date;
  access: string;
  deletedAt: Date | null;
};
export default function ProfilePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      getMyPosts(Number(session?.user?.id))?.then(setPosts);
    }
  }, [session]);

  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    const res = await updateProfile(Number(session?.user?.id), formData);
    if (res.success) {
      toast.success("Cập nhật thông tin thành công!", {
        style: { borderRadius: "1.5rem" },
      });
    } else {
      toast.error(res.error);
    }
    setIsPending(false);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      {/* PHẦN 1: ĐỔI THÔNG TIN */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          Cài đặt tài khoản
        </h2>
        <form action={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase mb-1">
              Tên hiển thị
            </label>
            <input
              name="name"
              defaultValue={session?.user?.name || ""}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={isPending}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300"
          >
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </section>

      {/* PHẦN 2: DANH SÁCH BÀI VIẾT */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Bài viết của bạn ({posts.length})
        </h2>
        <div className="grid gap-4">
          {posts.map((post: Post) => (
            <div
              key={post.id}
              className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div>
                <h3 className="font-bold text-slate-700">
                  {post.title || "Không tiêu đề"}
                </h3>
                <Link
                  href={`/tag/${encodeURIComponent(post.hashtag || "")}`}
                  className="text-xs text-slate-400 hover:text-blue-500 hover:underline"
                >
                  {post.hashtag}
                </Link>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `/post/edit/${post.id}`)
                  }
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Sửa bài
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-400 italic">Bạn chưa đăng bài viết nào.</p>
          )}
        </div>
      </section>
    </main>
  );
}
