"use server";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";

//hàm tạo bài viết
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const hashtag = formData.get("hashtag") as string;
  const authorRaw = formData.get("authorId");
  const authorId = authorRaw ? parseInt(authorRaw.toString()) : null;

  let success = false;

  if (!authorId || isNaN(authorId)) {
    // Nếu ID không hợp lệ, báo lỗi cụ thể thay vì để Prisma crash
    throw new Error("Lỗi xác thực: Không tìm thấy ID tác giả hợp lệ.");
  }

  // 1. Lấy ảnh thumbnail từ input ẩn (nếu người dùng có upload riêng)
  let thumbnail = formData.get("thumbnailUrl") as string;

  // 2. Nếu ko chọn ảnh thumbnail riêng, tự quét lấy ảnh đầu tiên trong bài
  if (!thumbnail || thumbnail === "") {
    thumbnail = getFirstImage(content) || "/default-thumbnail.png";
  }

  try {
    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        authorId: authorId,
        thumbnail: "/default-thumbnail.png",
        hashtag: (formData.get("hashtag") as string) || "#WIKI",
      },
    });
    revalidatePath("/"); // Tự động cập nhật trang chủ sau khi tạo bài viết mới
    return { success: true };
  } catch (error) {
    console.error("Lỗi Prisma:", error);
    return error;
  }
}

//hàm cập nhật bài viết đã tạo
export async function updatePost(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const content = formData.get("content") as string;
  const hashtag = formData.get("hashtag") as string;

  // Lấy bài viết từ DB
  const post = await prisma.post.findUnique({ where: { id } });

  // Kiểm tra quyền Server-side
  if (!session?.user?.id || !post) {
    throw new Error("Unauthorized");
  }

  const isAuthorized =
    String(post.authorId) === String(session.user.id) ||
    session.user.role === "ADMIN";
  if (!isAuthorized) throw new Error("Unauthorized");

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
}

//hàm tiện ích để lấy ảnh đầu tiên trong nội dung bài viết (nếu có) làm thumbnail
function getFirstImage(html: string): string | null {
  if (!html) return null;

  // Regex mới: Tìm thẻ img, lấy nội dung trong src, không quan tâm cách đóng thẻ
  const match = html.match(/<img\s+[^>]*src=["']([^"']+)["']/i);

  return match ? match[1] : null;
}

// lib/actions.ts
export async function deletePost(id: number) {
  const session = await getServerSession(authOptions);

  // 1. Nếu chưa đăng nhập -> Chặn
  if (!session) throw new Error("Vui lòng đăng nhập để thực hiện");

  // 2. Tìm bài viết để lấy thông tin tác giả
  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post) throw new Error("Bài viết không tồn tại");

  // 3. Kiểm tra quyền: Phải là Tác giả HOẶC Admin
  const isAuthor = String(post.authorId) === String(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    throw new Error("Bạn không có quyền xóa bài!");
  }

  // 4. Nếu hợp lệ -> Thực hiện xóa (hoặc đánh dấu xóa mềm deletedAt)
  return await prisma.post.delete({
    where: { id },
  });
}

// 1. Cập nhật Profile (Tên & Mật khẩu)
export async function updateProfile(userId: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    const data: any = { name };
    if (password && password.length > 0) {
      data.password = await password;
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể cập nhật thông tin" };
  }
}

// 2. Lấy danh sách bài viết của tôi (trừ bài đã xóa)
export async function getMyPosts(userId: number) {
  return await prisma.post.findMany({
    where: {
      authorId: userId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}
