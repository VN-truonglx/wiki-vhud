//Lấy ảnh thumbnail cho bài viết, nếu người dùng ko upload riêng thì tự quét lấy ảnh đầu tiên trong nội dung bài
// src/components/PostImage.tsx
'use client';

export default function PostImage({ src, title }: { src: string | null, title: string }) {
  const defaultThumb = "/default-thumbnail.png";

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // Nếu ảnh lỗi không phải là ảnh mặc định, thì mới thay bằng ảnh mặc định
    if (target.src !== window.location.origin + defaultThumb) {
      target.src = defaultThumb;
    } else {
      // Nếu ngay cả ảnh mặc định cũng lỗi (404), thì ngắt luôn để tránh loop
      target.onerror = null; 
      target.src = ""; // Hoặc để trống
    }
  };

  return (
    <img
      src={src || defaultThumb}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover"
      onError={handleError}
    />
  );
}