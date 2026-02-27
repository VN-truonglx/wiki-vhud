"use client";
import { motion } from "framer-motion";

interface MascotProps {
  emailLength: number;
  isPasswordFocus: boolean;
}

export default function MascotLogin({ emailLength, isPasswordFocus }: MascotProps) {
  // Tính toán góc liếc (Rotation) của mắt dựa trên độ dài email
  const eyeRotation = Math.min(Math.max(emailLength * 2 - 20, -15), 15);

  return (
    <div className="relative h-40 w-40 mx-auto -mb-10 z-10">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Thân gấu và các lớp SVG từ TunnelBear */}
        <circle cx="50" cy="50" r="45" fill="#448aff" /> {/* Nền xanh */}
        
        {/* Mặt gấu */}
        <g id="bear-face">
          <circle cx="50" cy="55" r="30" fill="#7B5B44" stroke="#5D4037" strokeWidth="2" />
          
          {/* Đôi mắt liếc theo email */}
          <motion.g 
            animate={{ x: emailLength > 0 ? eyeRotation / 2 : 0 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <circle cx="40" cy="50" r="3" fill="#000" />
            <circle cx="60" cy="50" r="3" fill="#000" />
          </motion.g>

          {/* Mõm gấu */}
          <circle cx="50" cy="62" r="8" fill="#EDD1B0" />
          <path d="M48 60 Q50 63 52 60" fill="none" stroke="#3E2723" strokeWidth="1" />
        </g>

        {/* Cánh tay che mắt khi nhập mật khẩu */}
        <motion.g
          initial={{ y: 50, opacity: 0 }}
          animate={{ 
            y: isPasswordFocus ? 0 : 50, 
            opacity: isPasswordFocus ? 1 : 0 
          }}
          transition={{ duration: 0.4, ease: "backOut" }}
        >
          {/* Vẽ 2 cánh tay gấu che lên vùng mắt */}
          <path d="M20 70 Q30 40 45 45" stroke="#7B5B44" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M80 70 Q70 40 55 45" stroke="#7B5B44" strokeWidth="10" strokeLinecap="round" fill="none" />
        </motion.g>
      </svg>
    </div>
  );
}