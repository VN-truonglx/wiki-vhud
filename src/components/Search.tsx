// src/components/Search.tsx
'use client'

export default function Search() {
  return (
    <form action="/" method="GET" className="relative group">
      <div className="relative flex items-center">
        {/* Icon kính lúp */}
        <span className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        
        {/* Input - Quan trọng nhất là name="q" */}
        <input 
          type="text"
          name="q"
          placeholder="Tìm bài viết theo từ khóa"
          className="w-[400px] pl-11 pr-24 py-2.5 bg-slate-100 border-none rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
        />

        {/* Nút bấm nằm lồng bên trong input cho đẹp */}
        <button 
          type="submit"
          className="absolute right-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all active:scale-95"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}