import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  params: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params.params;

  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Image not found", { status: 404 });
  }

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

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
