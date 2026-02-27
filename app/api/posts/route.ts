// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const newPost = await prisma.post.create({
      data: {
        title: title || "Bài viết không tiêu đề",
        content: content, // Lưu chuỗi HTML (có cả ảnh và size ảnh)
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}