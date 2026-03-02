"use client";

import { useRef, useState } from "react";
import { useBearImages } from "./useBearImages";
import { useBearAnimation } from "./useBearAnimation";
import { signIn } from "next-auth/react"; // 1. Import hàm signIn
import { useRouter } from "next/navigation"; // 2. Để chuyển trang sau khi login

export default function TunnelBearLogin() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái chờ
  const passRef = useRef<HTMLInputElement | null>(null);

  const { watchBearImages, hideBearImages, peakBearImages } = useBearImages();

  const { img, setFocus, focus, isAnimating } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    peakBearImages,
    emailLength: values.email.length,
    showPassword,
  });

  // 3. Hàm xử lý đăng nhập thực tế
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Để mình tự xử lý chuyển trang
      });

      if (result?.error) {
        alert("Email hoặc mật khẩu chưa đúng rồi!");
      } else {
        // Đăng nhập thành công, về trang chủ và refresh để Navbar nhận session mới
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
      <div className="bg-blue-600 text-white py-8 flex flex-col items-center gap-3">
        <img src={img} alt="TunnelBear" width={150} height={150} draggable={false} className="select-none" />
        <div className="text-lg font-semibold text-white/95">Chào mừng bạn đến với Wiki VHUD</div>
      </div>

      {/* 4. Thay đổi onSubmit từ preventDefault thành handleLogin */}
      <form className="p-8 space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Email</label>
          <input
            name="email"
            type="email"
            required
            value={values.email}
            onFocus={() => setFocus("EMAIL")}
            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="your_email@evnfc.vn" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Mật khẩu</label>
          <div className="flex gap-2">
            <input
              ref={passRef}
              name="password"
              required
              type={showPassword ? "text" : "password"}
              value={values.password}
              onPointerDown={() => setFocus("PASSWORD")}
              onFocus={() => setFocus("PASSWORD")}
              onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="••••••••"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                passRef.current?.focus();
                setFocus("PASSWORD");
                setShowPassword((v) => !v);
              }}
              className={`shrink-0 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 ${isAnimating ? "opacity-70" : ""}`}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Đang xác thực..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}