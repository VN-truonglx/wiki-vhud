"use client";

import { useState } from "react";
import { useBearImages } from "./useBearImages";
import { useBearAnimation } from "./useBearAnimation";

const { currentBearImage, setCurrentFocus, isAnimating } = useBearAnimation({
  watchBearImages,
  hideBearImages,
  peakBearImages,   
  emailLength: values.email.length,
  showPassword,
});

export default function TunnelBearLogin() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const { watchBearImages, hideBearImages, peakBearImages } = useBearImages();
    const { currentBearImage, setCurrentFocus } = useBearAnimation({
        watchBearImages,
        hideBearImages,
        peakBearImages,
        emailLength: values.email.length,
        showPassword,
    });

    return (
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-blue-600 text-white py-8 flex flex-col items-center gap-3">
                <img
                    src={currentBearImage}
                    alt="TunnelBear"
                    width={150}
                    height={150}
                    draggable={false}
                    className="select-none"
                />
                <div className="text-lg font-semibold text-white/95">
                    Chào mừng bạn đến với Wiki VHUD
                </div>
            </div>

            {/* Form */}
            <form
                className="p-8 space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Demo login");
                }}
            >
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-600">Email</label>
                    <input
                        name="email"
                        value={values.email}
                        onFocus={() => setCurrentFocus("EMAIL")}
                        onClick={() => setCurrentFocus("EMAIL")}  // tuỳ chọn
                        onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none
                       focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        placeholder="you@company.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-600">Password</label>

                    <div className="flex gap-2">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={values.password}
                            onFocus={() => setCurrentFocus("PASSWORD")}
                            onClick={() => setCurrentFocus("PASSWORD")}
                            onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none
             focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            placeholder="••••••••"
                        />

                        <button
                            type="button" // ⭐ để không submit form
                            onClick={() => setShowPassword((v) => !v)}
                            className="shrink-0 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            aria-pressed={showPassword}
                            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                    </div>

                    {/* (tuỳ chọn) Khi click Hiện/Ẩn, giữ gấu che mắt nếu đang focus password */}
                    {/* Không cần code thêm vì focus vẫn ở input password */}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md shadow-blue-200
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}