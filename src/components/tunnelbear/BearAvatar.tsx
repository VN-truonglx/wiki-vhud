"use client";

export default function BearAvatar({
  currentImage,
  size = 140,
}: {
  currentImage: string;
  size?: number;
}) {
  // Dùng <img> để đổi frame nhanh (next/image có thể tối ưu nhưng đôi khi “nặng” khi frame nhiều)
  return (
    <img
      src={currentImage}
      alt="TunnelBear"
      width={size}
      height={size}
      draggable={false}
      className="select-none"
      style={{ width: size, height: size }}
    />
  );
}