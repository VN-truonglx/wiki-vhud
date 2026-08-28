import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { visiblePostsWhere } from "@/lib/posts";
import PostsGrid from "@/components/PostsGrid";
import FilterBar from "@/components/FilterBar";
import { getServerSession } from "next-auth"; // Thêm để lấy session
import { authOptions } from "app/api/auth/[...nextauth]/route";

// 1. Thêm tham số searchParams vào hàm Home
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; tag?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const sort = resolvedParams.sort === "oldest" ? "oldest" : "newest";
  const tag = resolvedParams.tag || "";

  // 1. Lấy phiên đăng nhập phía Server
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  const visibleWhere = visiblePostsWhere(isLoggedIn);

  // 3. Truy vấn Prisma (giữ nguyên logic search, thêm lọc theo hệ thống + sắp xếp)
  const [posts, hashtagRows] = await Promise.all([
    prisma.post.findMany({
      where: {
        deletedAt: null,
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { content: { contains: query } },
              { hashtag: { contains: query } },
            ],
          },
          ...(tag ? [{ hashtag: tag }] : []),
          visibleWhere,
        ],
      },
      include: {
        author: true,
      },
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    }),
    // Danh sách hệ thống (hashtag) hiện có để làm bộ lọc
    prisma.post.findMany({
      where: { deletedAt: null, hashtag: { not: null }, ...visibleWhere },
      select: { hashtag: true },
      distinct: ["hashtag"],
      orderBy: { hashtag: "asc" },
    }),
  ]);

  const systems = hashtagRows
    .map((row) => row.hashtag)
    .filter((hashtag): hashtag is string => !!hashtag);

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-10">
      {/* Header Section */}
      <section className="relative py-12 mb-12 text-center overflow-hidden">
        {/* Điểm nhấn màu sắc mờ ảo phía sau */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-orange-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-70"></div>

        <span className="text-orange-500 font-bold tracking-[0.3em] text-xls uppercase mb-4 block">
          Trang thông tin
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Wiki{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
            VHUD
          </span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed py-3">
          Tổng hợp tất cả kiến thức vận hành các hệ thống tại EVF
        </p>
      </section>

      {/* 4. Hiển thị thông báo khi đang ở chế độ tìm kiếm */}
      {query && (
        <p className="mb-6 text-slate-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
          🔍 Tìm thấy{" "}
          <span className="font-bold text-blue-600">{posts.length}</span> kết
          quả cho:
          <span className="italic ml-1">"{query}"</span>
        </p>
      )}

      {/* Bộ lọc: sắp xếp mới nhất/cũ nhất + lọc theo hệ thống */}
      <Suspense fallback={null}>
        <FilterBar systems={systems} currentSort={sort} currentTag={tag} />
      </Suspense>

      {/* Danh sách bài viết + chuyển đổi hiển thị lưới/danh sách */}
      <PostsGrid
        posts={posts}
        emptyMessage={
          query || tag
            ? "Không tìm thấy kết quả phù hợp."
            : "Chưa có bài viết nào. Hãy là người đầu tiên đóng góp!"
        }
      />
    </main>
  );
}
