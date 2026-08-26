import Link from "next/link";
import PostImage from "@/components/PostImage";

type PostCardData = {
  id: number;
  title: string;
  hashtag: string | null;
  thumbnail: string | null;
  createdAt: Date;
  author: { name: string | null } | null;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/post/${post.id}`} className="group flex">
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
  );
}
