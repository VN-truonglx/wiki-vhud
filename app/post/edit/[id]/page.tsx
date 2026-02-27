"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { updatePost } from "@/lib/actions"; // Bạn cần tạo hàm này trong actions
import TiptapEditor from "@/components/TiptapEditor";

export default function EditPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [post, setPost] = useState<any>(null);
  const contentRef = useRef('');

  // Gọi API lấy dữ liệu cũ
  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        contentRef.current = data.content;
      });
  }, [id]);

  const handleUpdate = async (formData: FormData) => {
    formData.set("content", contentRef.current);
    // Ở đây ta truyền thêm ID vào Server Action để nó biết bài nào mà sửa
    await updatePost(id, formData);
  };

  if (!post) return <div className="p-10 text-center">Đang tải dữ liệu bài viết...</div>;

  return (
    <main className="max-w-7xl mx-auto p-10">
      <h1 className="text-2xl text-blue-700 font-bold mb-6">Bạn đang sửa bài viết:</h1>
      <form action={handleUpdate} className="space-y-6">
        <input
          type="text"
          name="title"
          defaultValue={post.title} // Hiện tiêu đề cũ
          className="text-4xl font-black w-full outline-none"
        />
        <input
          type="text"
          name="author"
          defaultValue={post.author} // Hiện tác giả cũ
          className="w-full text-slate-500 font-bold outline-none"
        />

        <div className="mb-6">
          <input
            type="text"
            name="hashtag"
            id="hashtag"
            className="w-full px-4 py-2 "
            placeholder="Ví dụ: #DATABASE, #GUIDE..."
            defaultValue={post.hashtag || '#WIKI_GUIDE'}
            required
          />
        </div>

        <TiptapEditor
          initialContent={post.content}
          onChange={(html) => (contentRef.current = html)}
        />

        <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700">
          Lưu thay đổi
        </button>
      </form>
    </main>
  );
}