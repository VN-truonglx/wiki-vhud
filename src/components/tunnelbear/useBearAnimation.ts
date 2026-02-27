"use client";

import { useEffect, useRef, useState } from "react";

type InputFocus = "EMAIL" | "PASSWORD";

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
  const [currentFocus, setCurrentFocus] = useState<InputFocus>("EMAIL");
  const [currentBearImage, setCurrentBearImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevFocus = useRef<InputFocus>(currentFocus);
  const prevShowPassword = useRef(showPassword);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => timeouts.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];

    const animateImages = (
      images: string[],
      interval: number,
      reverse = false,
      onComplete?: () => void
    ) => {
      if (!images.length) return onComplete?.();

      setIsAnimating(true);
      const seq = reverse ? [...images].reverse() : images;

      seq.forEach((img, idx) => {
        const id = window.setTimeout(() => {
          setCurrentBearImage(img);
          if (idx === seq.length - 1) {
            setIsAnimating(false);
            onComplete?.();
          }
        }, idx * interval);
        timeouts.current.push(id);
      });
    };

    const setWatchingFrame = () => {
      const progress = Math.min(emailLength / 30, 1);
      const index = Math.min(
        Math.floor(progress * (watchBearImages.length - 1)),
        watchBearImages.length - 1
      );
      setCurrentBearImage(watchBearImages[Math.max(0, index)] ?? null);
      setIsAnimating(false);
    };

    if (currentFocus === "EMAIL") {
      if (prevFocus.current === "PASSWORD") {
        animateImages(hideBearImages, 60, true, setWatchingFrame);
      } else {
        setWatchingFrame();
      }
    }

    if (currentFocus === "PASSWORD") {
      if (prevFocus.current !== "PASSWORD") {
        animateImages(hideBearImages, 40, false, () => {
          if (showPassword) animateImages(peakBearImages, 50);
        });
      } else if (showPassword && prevShowPassword.current === false) {
        animateImages(peakBearImages, 50);
      } else if (!showPassword && prevShowPassword.current === true) {
        animateImages(peakBearImages, 50, true);
      }
    }

    prevFocus.current = currentFocus;
    prevShowPassword.current = showPassword;
  }, [currentFocus, showPassword, emailLength, watchBearImages, hideBearImages, peakBearImages]);

  return {
    currentFocus,
    setCurrentFocus,
    currentBearImage: currentBearImage ?? watchBearImages[0] ?? null,
    isAnimating,
  };
}