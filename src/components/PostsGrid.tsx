"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import PostCard from "@/components/PostCard";

type PostCardData = {
  id: number;
  title: string;
  hashtag: string | null;
  thumbnail: string | null;
  createdAt: Date;
  author: { name: string | null } | null;
};

const VIEW_STORAGE_KEY = "wiki-post-view";

export default function PostsGrid({
  posts,
  emptyMessage,
}: {
  posts: PostCardData[];
  emptyMessage: string;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "grid" || stored === "list") setView(stored);
  }, []);

  function changeView(next: "grid" | "list") {
    setView(next);
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button
            type="button"
            aria-label="Hiển thị dạng lưới"
            onClick={() => changeView("grid")}
            className={`p-2 rounded-full transition-colors ${
              view === "grid"
                ? "bg-white shadow text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            aria-label="Hiển thị dạng danh sách"
            onClick={() => changeView("list")}
            className={`p-2 rounded-full transition-colors ${
              view === "list"
                ? "bg-white shadow text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">{emptyMessage}</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard post={post} view="list" key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
}
