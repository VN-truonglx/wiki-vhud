import { prisma } from "@/lib/db";
import Link from "next/link";
import { Pencil, ChevronLeft } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import PostAdminMenu from "@/components/PostAdminMenu";

import { redirect } from "next/navigation";

export default async function PostDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) return notFound();

  const session = await getServerSession(authOptions);
  // Dòng này để debug: Bạn hãy xem ở terminal (vùng chạy npm run dev)
  // console.log("DEBUG SESSION USER:", session?.user);
  const userRole = (session?.user as any)?.role;
  const canEdit = userRole === "ADMIN" || userRole === "INTERNAL";
  const canManage = userRole === "ADMIN" || userRole === "INTERNAL";

  // 2. Lấy thông tin bài viết và author từ DB
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { author: true } // Đảm bảo include author để lấy tên/role
  });

  if (!post) notFound();

  // 3. Kiểm tra quyền truy cập: Nếu bài viết là INTERNAL thì chỉ cho phép ADMIN và INTERNAL xem
  if (post.access === "INTERNAL" && !session) {
    redirect("/login");
  }
  // Nếu bài viết dành cho ADMIN mà user không phải ADMIN, có thể chặn tiếp
  if (post.access === "ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return <div>Bạn không có quyền xem bài viết này.</div>;
  }

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12">

      <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ChevronLeft size={20} /> Quay lại danh sách
      </Link>

      <article className="relative bg-white rounded-3xl shadow-sm border p-8 md:p-16">

        {/* NÚT CHỈNH SỬA - Chỉ hiển thị khi có quyền */}
        {canEdit && (
          <div className="absolute top-20 right-8">
            <article className="relative">
              <div className="flex justify-between items-start mb-6">
                {/* Nút Menu quản lý gom gọn */}
                {canManage && (
                  <PostAdminMenu postId={post.id} />
                )}
              </div>
              {/* ... nội dung bài viết ... */}
            </article>
            {/* <Link
              href={`/post/edit/${id}`}
              className="flex items-center gap-2 bg-slate-50 hover:bg-orange-500 hover:text-white text-slate-600 px-5 py-2.5 rounded-full transition-all duration-300 font-semibold border shadow-sm"
            >
              <Pencil size={17} />
              <span className="hidden md:inline">Sửa bài</span>
            </Link> */}
          </div>
        )}

        <header className="mb-10 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-500">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase text-xl">
              {(post.author?.name?.[0] ?? "?").toUpperCase()}
            </div>
            <div>
              {/* Hiển thị tên tác giả từ quan hệ bảng User */}
              <p className="font-bold text-slate-800">{post.author?.name || "Ẩn danh"}</p>
              <p className="text-sm">Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </header>

        <div
          className="prose prose-orange max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}