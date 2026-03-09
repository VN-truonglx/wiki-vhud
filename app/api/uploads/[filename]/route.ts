import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  // 1. Kiểm tra file tồn tại
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Image not found", { status: 404 });
  }

  // 2. Xác định Content-Type dựa trên đuôi file
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  // 3. Đọc file và trả về với Header đúng định dạng
  const fileBuffer = fs.readFileSync(filePath);
  
  return new NextResponse(fileBuffer, {
    headers: { 
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable", // Thêm cache để web load nhanh hơn
    },
  });
}