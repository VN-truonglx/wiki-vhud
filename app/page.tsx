import { prisma } from "@/lib/db";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import { getServerSession } from "next-auth"; // Thêm để lấy session
import { authOptions } from "app/api/auth/[...nextauth]/route";

// 1. Thêm tham số searchParams vào hàm Home
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // 1. Lấy phiên đăng nhập phía Server
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  // 3. Truy vấn Prisma (giữ nguyên logic search)
  const posts = await prisma.post.findMany({
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
        {
          OR: [
            { access: "PUBLIC" }, // Luôn hiển thị bài Public
            ...(isLoggedIn ? [{ access: "INTERNAL" }] : []), // Chỉ hiện bài Internal nếu đã đăng nhập
            //Nếu thêm role ADMIN và muốn bài ADMIN chỉ ADMIN thấy:
            // ...(session?.user?.role === "ADMIN" ? [{ access: "ADMIN" }] : []),
          ],
        },
      ],
    },
    include: {
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });

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

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">
              {query
                ? "Không tìm thấy kết quả phù hợp."
                : "Chưa có bài viết nào. Hãy là người đầu tiên đóng góp!"}
            </p>
          </div>
        ) : (
          posts.map((post: any) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className="group flex"
            >
              <article className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col w-full transform hover:-translate-y-2">
                {/* 1. Thumbnail Area */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <PostImage src={post.thumbnail} title={post.title} />
                  {/* Overlay Gradient nhẹ để text hashtag nổi bật nếu cần */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* 2. Content Area */}
                <div className="p-7 flex-1 flex flex-col">
                  {/* 2.1 Hashtag (Tasty Style) */}
                  <div className="mb-4">
                    <span className="text-[12px] font-normal text-blue-400">
                      {post.hashtag}
                    </span>
                  </div>

                  {/* 2.2 Tiêu đề (Bỏ Uppercase để dễ đọc hơn, đúng chất blog) */}
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* 3. Footer (Tác giả & Ngày đăng) */}
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-3">
                    {/* Avatar giả lập từ tên tác giả */}
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-100">
                      {(post.author?.name?.[0] ?? "?").toUpperCase()}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-none mb-1">
                        {post.author?.name || "Ban VHUD"}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Icon mũi tên đi kèm và từ "Xem thêm"*/}
                    <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <span className="text-xs font-normal text-orange-500 uppercase">
                        Xem thêm
                      </span>
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
