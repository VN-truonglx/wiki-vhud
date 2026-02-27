import { prisma } from "@/lib/db";
import Link from "next/link";
import { Pencil, ChevronLeft } from "lucide-react"; //icon bút chì vào menu chỉnh sửa

import { notFound } from "next/navigation";

// 1. Thêm async vào định nghĩa props nếu cần (Next.js 15+)
export default async function PostDetailPage({
  params
}: {
  params: Promise<{ id: string }> // Khai báo params là một Promise
}) {

  // 2. GIẢI PHÁP CHÍNH: Phải await params trước khi dùng
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  // 3. Kiểm tra xem ID có phải là số hợp lệ không
  if (isNaN(id)) return notFound();

  const post = await prisma.post.findUnique({
    where: { id: id }
  });

  if (!post) notFound();

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12">
      <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ChevronLeft size={20} /> Quay lại danh sách
      </Link>

      <article className="relative bg-white rounded-3xl shadow-sm border p-8 md:p-16">
        {/* NÚT CHỈNH SỬA - Đặt ở góc trên bên phải */}
        <div className="absolute top-20 right-8">
          <Link
            href={`/post/edit/${id}`}
            className="flex items-center gap-2 bg-slate-50 hover:bg-orange-500 hover:text-white text-slate-600 px-5 py-2.5 rounded-full transition-all duration-300 font-semibold border shadow-sm"
          >
            <Pencil size={17} />
            <span className="hidden md:inline">Sửa bài</span>
          </Link>
        </div>
        <header className="mb-10 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-500">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase text-xl">
              {(post.author?.name?.[0] ?? "?").toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-800">{post.author}</p>
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