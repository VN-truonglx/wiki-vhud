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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Truy vấn user từ Database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Nếu không tìm thấy user
        if (!user) return null;

        //So sánh password - Lưu ý: Trong thực tế, bạn phải hash password và so sánh hash, ko đc lưu trực tiếp
        const isPasswordCorrect = credentials.password === user.password;

        if (!isPasswordCorrect) return null;

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