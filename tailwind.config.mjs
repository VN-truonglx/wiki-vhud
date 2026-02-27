/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Chạy lệnh 'npm install -D @tailwindcss/typography' trước nếu chưa cài
    // Nếu vẫn lỗi, tạm thời comment dòng dưới lại
    require('@tailwindcss/typography'), 
  ],
};

