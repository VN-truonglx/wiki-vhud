import { prisma } from "@/lib/db";
import { visiblePostsWhere } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export default async function TagPage({
  params,
}: {
  params: Promise<{ hashtag: string }>;
}) {
  const { hashtag: rawHashtag } = await params;
  const hashtag = decodeURIComponent(rawHashtag);

  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      hashtag,
      ...visiblePostsWhere(isLoggedIn),
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-10">
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors w-fit"
      >
        <ChevronLeft size={20} /> Quay lại trang chủ
      </Link>

      <section className="mb-10 text-center">
        <span className="text-orange-500 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
          Hashtag
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900">
          {hashtag}
        </h1>
        <p className="text-slate-500 mt-4">
          <span className="font-bold text-blue-600">{posts.length}</span> bài
          viết cùng hashtag
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">
              Chưa có bài viết nào dùng hashtag này.
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard post={post} key={post.id} />)
        )}
      </div>
    </main>
  );
}
