"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORTS = [
  ["newest", "Mới nhất"],
  ["oldest", "Cũ nhất"],
] as const;

type Props = {
  systems: string[];
  currentSort: "newest" | "oldest";
  currentTag: string;
};

export default function FilterBar({
  systems,
  currentSort,
  currentTag,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    router.push(`${pathname}?${params}`);
  };

  const tagClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 focus:ring-2 focus:ring-blue-500"
        >
          {SORTS.find(([value]) => value === currentSort)?.[1]}
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute z-[60] mt-2 w-max min-w-full overflow-hidden whitespace-nowrap rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {SORTS.map(([value, label]) => {
              const active = currentSort === value;

              return (
                <button
                  key={value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    updateParam("sort", value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-slate-50 ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["", ...systems].map((tag) => (
          <button
            key={tag || "all"}
            type="button"
            onClick={() => updateParam("tag", tag)}
            className={tagClass(currentTag === tag)}
          >
            {tag || "Tất cả hệ thống"}
          </button>
        ))}
      </div>
    </div>
  );
}