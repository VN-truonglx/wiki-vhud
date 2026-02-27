"use client";
import { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock } from "lucide-react";
import TunnelBearLogin from "@/components/tunnelbear/TunnelBearLogin";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Sau này bạn sẽ tích hợp logic NextAuth tại đây
    console.log("Đăng nhập với:", { email, password });
    alert("Tính năng đăng nhập đang được kết nối với Database!");
  };

  return (
       <main className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-6">
          <TunnelBearLogin />
        </main>
  );

}
