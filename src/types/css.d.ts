// Cho phép import trực tiếp file .css thuần (vd CSS theme của thư viện ngoài
// như highlight.js/styles/*.css) mà không bị TypeScript/VSCode báo lỗi
// "Cannot find module ... or its corresponding type declarations".
// Next.js xử lý các import này ở build time qua webpack/turbopack, TypeScript
// chỉ cần biết module tồn tại để type-check qua.
declare module "*.css";
