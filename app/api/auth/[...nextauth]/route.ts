import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

/*
  Mở rộng Type để TypeScript nhận diện trường 'role'
*/
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    id?: string;
  }
}

const AD_EMAIL_DOMAIN = "evnfc.vn";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email hoặc Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Xác thực qua API nội bộ (hệ thống này đã xác thực với AD)
        let authMessage: string | undefined;
        try {
          const res = await fetch(process.env.AD_AUTH_API_URL as string, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });
          const body = await res.json();
          authMessage = body?.message;
        } catch (error) {
          console.error("AD auth API error:", error);
          return null;
        }

        if (authMessage !== "Đăng nhập thành công") return null;

        // Chuẩn hoá định danh về dạng email đầy đủ, vì API AD chấp nhận cả
        // username thuần (vd "vanhanh") lẫn email (vd "vanhanh@evnfc.vn") -
        // nếu không chuẩn hoá, mỗi cách gõ sẽ tạo ra 2 record khác nhau trong DB.
        const normalizedEmail = credentials.email.includes("@")
          ? credentials.email
          : `${credentials.email}@${AD_EMAIL_DOMAIN}`;

        // Xác thực AD thành công - lấy (hoặc tạo mới) record local chỉ để lưu role/tên hiển thị
        const user = await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {},
          create: { email: normalizedEmail, role: "PUBLIC" },
        });

        // Trả về object User để đưa vào JWT
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],

  callbacks: {
    // 1. JWT Callback: Lưu role từ User vào Token khi đăng nhập thành công
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // 2. Session Callback: Lấy role từ Token truyền ra Session cho Client/Server Page dùng
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login", //Trang có tunnelbear và form đăng nhập
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };