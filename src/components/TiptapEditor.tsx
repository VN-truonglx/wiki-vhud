"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ResizeImage from 'tiptap-extension-resize-image';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useState, useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Code, Terminal,
  Undo, Redo, Link as LinkIcon, Image as ImageIcon,
  Highlighter, Sun, Moon
} from "lucide-react";
interface TiptapProps {
  onChange: (html: string) => void;
  initialContent?: string;
}
const TiptapEditor = ({ onChange, initialContent }: TiptapProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const editor = useEditor({
    extensions: [
      (ResizeImage as any).configure({
        HTMLAttributes: {
          class: 'rounded-xl border-2 border-slate-100 shadow-lg my-4',
        },
        allowResize: true,
      }),
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline cursor-pointer' } }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent,
    immediatelyRender: false,
    // 2. QUAN TRỌNG: Đưa onUpdate ra ngoài mảng extensions
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },

    //bắt sự kiện paste ảnh GIF từ clipboard vào editor 
    editorProps: {
      handlePaste: (view, event) => {
        // 1. Xử lý đặc biệt cho ảnh GIF copy từ trình duyệt (tránh bị chuyển thành PNG tĩnh)
        const html = event.clipboardData?.getData('text/html');
        if (html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const img = doc.querySelector('img');
          
          // Nếu là ảnh GIF
          if (img && img.src && /\.gif($|\?)/i.test(img.src)) {
            event.preventDefault();
            
            // Thử fetch blob để upload (giữ animation)
            fetch(img.src)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], "pasted.gif", { type: "image/gif" });
                uploadAndInsertImage(file);
              })
              .catch(() => {
                // Fallback: Nếu lỗi (ví dụ CORS), chèn link trực tiếp để giữ animation
                editor?.chain().focus().setImage({ src: img.src }).run();
              });
            return true;
          }
        }

        const items = Array.from(event.clipboardData?.items || []);

        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (file) {
              // Ngăn chặn hành vi paste mặc định của trình duyệt
              event.preventDefault();

              // Gọi hàm upload ảnh của bạn (đã viết sẵn ở trên)
              uploadAndInsertImage(file);
              return true;
            }
          }
        }
        return false; // Để các dữ liệu khác (text) paste bình thường
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            uploadAndInsertImage(file);
            return true;
          }
        }
        return false;
      },
    },
  });
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);
  const uploadAndInsertImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        editor?.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
    }
  };


  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Nhập địa chỉ URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        alert("Không thể tải ảnh lên!");
      }
    }
  };

  const triggerImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) await uploadAndInsertImage(file);
    };
    input.click();
  };

  return (
    <div className={`w-full border rounded-[2rem] transition-all duration-500 shadow-2xl ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}>

      {/* TOOLBAR */}
      <div className={`sticky top-0 z-50 flex items-center gap-0.5 p-1.5 border-b transition-colors ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
        <div className="flex gap-1 mr-2">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 hover:bg-orange-100 rounded-lg"><Undo size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 hover:bg-orange-100 rounded-lg"><Redo size={18} /></button>
        </div>

        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
          }}
          className={`text-xs font-bold px-2 py-1.5 rounded-lg border outline-none ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}
        >
          <option value="p">Văn bản</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-[1px] h-6 bg-slate-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg ${editor.isActive("bold") ? "bg-orange-500 text-white shadow-md" : "hover:bg-orange-100"}`}><Bold size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg ${editor.isActive("italic") ? "bg-orange-500 text-white shadow-md" : "hover:bg-orange-100"}`}><Italic size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg ${editor.isActive("underline") ? "bg-orange-500 text-white shadow-md" : "hover:bg-orange-100"}`}><UnderlineIcon size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-lg ${editor.isActive("strike") ? "bg-orange-500 text-white shadow-md" : "hover:bg-orange-100"}`}><Strikethrough size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 rounded-lg ${editor.isActive("highlight") ? "bg-yellow-400 text-black shadow-md" : "hover:bg-orange-100"}`}><Highlighter size={18} /></button>

        <div className="w-[1px] h-6 bg-slate-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-2 rounded-lg ${editor.isActive({ textAlign: "left" }) ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}><AlignLeft size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-2 rounded-lg ${editor.isActive({ textAlign: "center" }) ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}><AlignCenter size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={`p-2 rounded-lg ${editor.isActive({ textAlign: "justify" }) ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}><AlignJustify size={18} /></button>

        <div className="w-[1px] h-6 bg-slate-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg ${editor.isActive("bulletList") ? "bg-slate-600 text-white" : "hover:bg-slate-100"}`}><List size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg ${editor.isActive("orderedList") ? "bg-slate-600 text-white" : "hover:bg-slate-100"}`}><ListOrdered size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded-lg ${editor.isActive("taskList") ? "bg-slate-600 text-white" : "hover:bg-slate-100"}`}><CheckSquare size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-lg ${editor.isActive("blockquote") ? "bg-slate-600 text-white" : "hover:bg-slate-100"}`}><Quote size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded-lg ${editor.isActive("codeBlock") ? "bg-slate-600 text-white" : "hover:bg-slate-100"}`}><Terminal size={18} /></button>

        <div className="w-[1px] h-6 bg-slate-300 mx-1" />

        <button type="button" onClick={setLink} className={`p-2 rounded-lg ${editor.isActive("link") ? "text-blue-600" : "hover:bg-slate-100"}`}><LinkIcon size={18} /></button>
        <button type="button" onClick={triggerImageUpload} className="p-2 hover:bg-slate-200 rounded-md transition-colors"><ImageIcon size={18} /></button>

        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`ml-auto p-2 rounded-full transition-colors ${isDarkMode ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-slate-800 text-white hover:bg-slate-700"}`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* EDITOR CONTENT */}
      <div className={`p-4 min-h-[400px] transition-colors ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
        <EditorContent editor={editor} className="prose prose-slate max-w-none dark:prose-invert" />
      </div>

      <style jsx global>{`
        .ProseMirror { min-height: 400px; padding: 20px; outline: none; }
        .ProseMirror blockquote { border-left: 4px solid #f97316; padding-left: 1rem; font-style: italic; }
        .ProseMirror ul[data-type="taskList"] { list-style: none; padding: 0; }
        .ProseMirror li[data-type="taskItem"] { display: flex; align-items: flex-start; gap: 0.5rem; }
        .ProseMirror code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
        .dark .ProseMirror code { background: #334155; }
      `}</style>
    </div>
  );
};

export default TiptapEditor;