// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Khai báo là Promise
) {
    try {
        //1. giải nén params
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        //2. kiểm tra id hợp lệ
        if (isNaN(id)) {
            return NextResponse.json({ error: "Không có ID bài viết hợp lệ" }, { status: 400 });
        }

        //3. tìm bài viết trong DB
        const post = await prisma.post.findUnique({
            where: { id: id },
        });

        //4. kiểm tra bài viết có tồn tại không
        if (!post) {
            return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
        }
        //5. trả về bài viết
        return NextResponse.json(post);
    } catch (err) {
        console.error("❌ API Error [GET /api/posts/[id]]:", err); /*Lỗi cụ thể hiển thị trên Terminal */
        return NextResponse.json(
            {error: "Lỗi Server"},
            { status: 500 }
        );
    }    
}