import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Ép kiểu để Next.js hiểu đây là API Route, không phải Server Action
export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dùng đường dẫn tuyệt đối để tránh lỗi 500
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Tự động tạo thư mục nếu chưa có
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error: any) {
    // In lỗi chi tiết ra console để "bắt bài" server
    console.error("CHI TIẾT LỖI TẠI SERVER:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}