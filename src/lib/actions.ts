"use server"
import { prisma } from "./db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

//hàm tạo bài viết
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const hashtag = formData.get("hashtag") as string;

  // 1. Lấy ảnh thumbnail từ input ẩn (nếu người dùng có upload riêng)
  let thumbnail = formData.get("thumbnailUrl") as string;

  // 2. Nếu ko chọn ảnh thumbnail riêng, tự quét lấy ảnh đầu tiên trong bài
  if (!thumbnail || thumbnail === "") {
    thumbnail = getFirstImage(content) || "/default-thumbnail.png";
  }

  try {
    await prisma.post.create({
      data: { title, content, author, thumbnail, hashtag }
    });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    throw new Error("Không thể tạo bài viết");
  }

  revalidatePath("/");
  redirect("/");
}

//hàm cập nhật bài viết đã tạo
export async function updatePost(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const content = formData.get("content") as string;
  const hashtag = formData.get("hashtag") as string;

  // Lấy ảnh thumbnail từ content, tương tự như hàm createPost
  const thumbnail = getFirstImage(content) || "/default-thumbnail.png";

  try {
    await prisma.post.update({
      where: { id: id },
      data: {
        title: title,
        // author,
        content: content,
        thumbnail: thumbnail, 
        hashtag: hashtag,
      },
    });
  } catch (error: any) {
    console.error("LỖI CHI TIẾT TẠI SERVER:", error.message); // Xem ở terminal
    throw new Error(`❌Lỗi: ${error.message}`);
  }
  revalidatePath(`/post/${id}`);
  revalidatePath("/");

  redirect(`/post/${id}`); // Sửa xong thì xem lại bài đó luôn
}

//hàm tiện ích để lấy ảnh đầu tiên trong nội dung bài viết (nếu có) làm thumbnail
function getFirstImage(html: string): string | null {
  if (!html) return null;

  // Regex mới: Tìm thẻ img, lấy nội dung trong src, không quan tâm cách đóng thẻ
  const match = html.match(/<img\s+[^>]*src=["']([^"']+)["']/i);

  return match ? match[1] : null;
}