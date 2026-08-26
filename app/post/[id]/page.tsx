import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import PostAdminMenu from "@/components/PostAdminMenu";
import PostContent from "@/components/PostContent";

export default async function PostDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) return notFound();

  // 1. Lấy thông tin bài viết và tác giả từ DB
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { author: true }
  });

  if (!post) notFound();

  // 2. Lấy session và phân quyền
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userRole = (session?.user as any)?.role;

  // Ép kiểu String để tránh lỗi ID lệch kiểu dữ liệu
  const isAuthor = userId && String(post.authorId) === String(userId);
  const isAdmin = userRole === "ADMIN";
  const canManage = isAdmin || isAuthor;

  // 3. Kiểm tra quyền XEM (Bảo mật nội bộ)
  if (post.access === "INTERNAL" && !session) {
    redirect("/login");
  }

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12">
      <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors w-fit">
        <ChevronLeft size={20} /> Quay lại danh sách
      </Link>

      <article className="relative bg-white rounded-3xl shadow-sm border p-3 md:p-10">
        
        {/* MENU QUẢN LÝ - Chỉ hiện cho Admin hoặc Tác giả */}
        {canManage && (
          <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10">
            <PostAdminMenu postId={post.id} />
          </div>
        )}

        <header className="mb-7 border-b border-blue-700/20 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href={`/tag/${encodeURIComponent(post.hashtag || "#WIKI_GUIDE")}`}
              className="bg-blue-50 text-blue-600 text-[15px] font-bold px-3 py-1 rounded-full uppercase hover:bg-blue-100 transition-colors"
            >
              {post.hashtag || "#WIKI_GUIDE"}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-500">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm">
              {(post.author?.name?.[0] ?? "?").toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-none mb-1">
                {post.author?.name || "Thành viên Wiki"}
              </p>
              <p className="text-xs">
                Cập nhật: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </header>

        {/* NỘI DUNG BÀI VIẾT - Đây là nơi xử lý code block và image */}
        <PostContent htmlContent={post.content} />
      </article>
    </main>
  );
}