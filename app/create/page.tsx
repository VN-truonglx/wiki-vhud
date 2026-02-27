"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPost } from "@/lib/actions";
import TiptapEditor from "@/components/TiptapEditor";

type Access = "PUBLIC" | "INTERNAL";

function PublishSplitButton({
  access,
  setAccess,
}: {
  access: Access;
  setAccess: (v: Access) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const accessLabel = useMemo(
    () => (access === "PUBLIC" ? "Công khai (Mọi người)" : "Nội bộ (Chỉ thành viên)"),
    [access]
  );

  const tooltipText = useMemo(
    () => `Bài sẽ được đăng ở chế độ ${accessLabel}`,
    [accessLabel]
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="flex items-center gap-4 group">
      <div ref={wrapRef} className="relative inline-flex items-stretch">
        {/* Tooltip */}
        <div
          className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 w-max -translate-x-1/2
                     rounded-xl bg-slate-900 px-4 py-2 text-sm text-white opacity-0 shadow-lg
                     transition group-hover:opacity-100"
          role="tooltip"
        >
          {tooltipText}
          <div
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900"
            aria-hidden="true"
          />
        </div>

        {/* Left: submit */}
        <button
          type="submit"
          className="rounded-l-full bg-orange-500 px-6 py-3 text-lg font-extrabold tracking-wide text-white
                     shadow-md shadow-orange-200 transition
                     hover:bg-orange-600 active:bg-orange-700
                     focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          ĐĂNG BÀI
        </button>

        <div className="w-px bg-white/40" aria-hidden="true" />

        {/* Right: dropdown toggle */}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid w-13 place-items-center rounded-r-full bg-orange-500 text-white
                     shadow-md shadow-orange-200 transition
                     hover:bg-orange-600 active:bg-orange-700
                     focus:outline-none focus:ring-4 focus:ring-orange-200"
          title="Đổi chế độ hiển thị"
        >
          <svg
            className={`h-6 w-6 transition ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-full z-40 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            role="menu"
          >
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Chế độ hiển thị
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAccess("PUBLIC");
                setOpen(false);
              }}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${access === "PUBLIC" ? "bg-orange-50" : ""
                }`}
            >
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${access === "PUBLIC" ? "bg-orange-500" : "bg-slate-300"}`} />
              <div>
                <div className="font-semibold text-slate-800">Công khai (Mọi người)</div>
                <div className="text-sm text-slate-500">Ai cũng có thể xem bài viết.</div>
              </div>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAccess("INTERNAL");
                setOpen(false);
              }}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${access === "INTERNAL" ? "bg-orange-50" : ""
                }`}
            >
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${access === "INTERNAL" ? "bg-orange-500" : "bg-slate-300"}`} />
              <div>
                <div className="font-semibold text-slate-800">Nội bộ (Chỉ thành viên)</div>
                <div className="text-sm text-slate-500">Chỉ thành viên đăng nhập mới xem được.</div>
              </div>
            </button>
          </div>
        )}

        {/* Hidden input để submit cùng form */}
        <input type="hidden" name="access" value={access} />
      </div>

    </div>
  );
}

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [access, setAccess] = useState<Access>("PUBLIC");

  const handleClientAction = async (formData: FormData) => {
    formData.set("content", content);

    if (!content || content === "<p></p>") {
      alert("⚠ Chưa có nội dung bài viết!");
      return;
    }

    await createPost(formData);
  };

  return (
    <main className="max-w-7xl mx-auto p-10">
      <form action={handleClientAction} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề bài viết..."
          required
          className="text-4xl font-black w-full outline-none placeholder:text-slate-200 text-slate-800"
        />

        <input
          type="text"
          name="author"
          placeholder="Tên người viết..."
          required
          className="w-full font-bold text-slate-500 outline-none"
        />

        <input
          type="text"
          name="hashtag"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Phân loại bài viết, VD: #T24, #ELS..."
          defaultValue="#WIKI_GUIDE"
          required
        />

        <TiptapEditor onChange={(html: string) => setContent(html)} />

        {/* Split publish button */}
        <div className="pt-4 flex">
          <PublishSplitButton access={access} setAccess={setAccess} />
        </div>
      </form>
    </main>
  );
}