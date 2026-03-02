"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import TunnelBearLogin from "@/components/tunnelbear/TunnelBearLogin";


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Để mình tự xử lý chuyển trang
    });

    if (res?.error) {
      setError("Email hoặc mật khẩu không chính xác!");
      // Bạn có thể thêm hiệu ứng cho chú gấu lắc đầu ở đây
    } else {
      router.push("/"); // Đăng nhập xong về trang chủ
      router.refresh();
    }
  };

  return (
       <main className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-6">
          <TunnelBearLogin />
        </main>
  );

}
