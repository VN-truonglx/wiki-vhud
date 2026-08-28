"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterBar({
  systems,
  currentSort,
  currentTag,
}: {
  systems: string[];
  currentSort: "newest" | "oldest";
  currentTag: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="px-4 py-2.5 rounded-full bg-slate-100 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
      </select>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => updateParam("tag", "")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            !currentTag
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả hệ thống
        </button>
        {systems.map((system) => (
          <button
            type="button"
            key={system}
            onClick={() => updateParam("tag", system)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              currentTag === system
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {system}
          </button>
        ))}
      </div>
    </div>
  );
}
