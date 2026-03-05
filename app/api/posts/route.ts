// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";  

// const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, authorId } = body;

    const newPost = await prisma.post.create({
      data: {
        title: title || "Bài viết không tiêu đề",
        content: content, // Lưu chuỗi HTML (có cả ảnh và size ảnh)
        author: {
          connect: { id: authorId },
        },
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}