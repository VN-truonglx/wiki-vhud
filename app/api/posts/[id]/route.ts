// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

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
            { error: "Lỗi Server" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = parseInt(id);

    const session = await getServerSession(authOptions);
    if (isNaN(postId)) {
        return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    if (!session || (session.user as any).role === "USER") {
        return NextResponse.json({ message: "Không có quyền" }, { status: 403 });
    }


    try {
        await prisma.post.update({
            where: { id: postId },
            data: { deletedAt: new Date() }, // Lệnh xóa mềm
        });
        return NextResponse.json({ message: "Xóa thành công" });
    } catch (error) {
        console.error("Lỗi xóa bài:", error);
        return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 });
    }
}
