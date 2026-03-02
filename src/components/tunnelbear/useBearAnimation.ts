"use client";

import { useEffect, useRef, useState } from "react";
type Focus = "EMAIL" | "PASSWORD";

export function useBearAnimation({
  watchBearImages,
  hideBearImages,
  peakBearImages,
  emailLength,
  showPassword,
}: {
  watchBearImages: string[];
  hideBearImages: string[];
  peakBearImages: string[];
  emailLength: number;
  showPassword: boolean;
}) {
  const [focus, setFocus] = useState<Focus>("EMAIL");
  const [img, setImg] = useState(watchBearImages[0] ?? "");

  const prevFocus = useRef<Focus>("EMAIL");
  const prevShow = useRef<boolean>(showPassword);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const animate = (frames: string[], interval = 40, reverse = false) => {
    if (!frames.length) return;
    const seq = reverse ? [...frames].reverse() : frames;
    seq.forEach((src, i) => {
      const id = window.setTimeout(() => setImg(src), i * interval);
      timers.current.push(id);
    });
  };

  const setWatch = () => {
    if (!watchBearImages.length) return;
    const progress = Math.min(emailLength / 22, 1);
    const idx = Math.round(progress * (watchBearImages.length - 1));
    setImg(watchBearImages[idx] ?? watchBearImages[0]);
  };

  useEffect(() => {
    clearTimers();

    // debug logs
    // console.log("focus:", focus, "prev:", prevFocus.current, "show:", showPassword);

    // 1) Vào PASSWORD lần đầu => che mắt (hide)
    if (focus === "PASSWORD" && prevFocus.current !== "PASSWORD") {
      animate(hideBearImages, 35, false);
    }

    // 2) Đang PASSWORD mà toggle Hiện/Ẩn => peak
    if (focus === "PASSWORD" && prevFocus.current === "PASSWORD") {
      if (showPassword !== prevShow.current) {
        // showPassword=true => peak forward; false => peak reverse
        animate(peakBearImages, 45, !showPassword);
      }
    }

    // 3) EMAIL => watch, nếu từ PASSWORD về EMAIL thì hạ tay rồi watch
    if (focus === "EMAIL") {
      if (prevFocus.current === "PASSWORD") animate(hideBearImages, 45, true);
      setWatch();
    }

    prevFocus.current = focus;
    prevShow.current = showPassword;
  }, [focus, emailLength, showPassword]); // ✅ arrays không đưa vào deps

  return { img, setFocus, focus };
}