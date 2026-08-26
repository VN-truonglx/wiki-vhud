// Điều kiện lọc quyền xem bài viết dùng chung giữa trang chủ và trang danh sách theo hashtag
export function visiblePostsWhere(isLoggedIn: boolean) {
  return {
    OR: [
      { access: "PUBLIC" },
      ...(isLoggedIn ? [{ access: "INTERNAL" }] : []),
    ],
  };
}
