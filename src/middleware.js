export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/math/workout/:path*",
    "/parent/:path*"
  ]
};
