import middlewareImport from "next-auth/middleware";

const proxyFunction = middlewareImport.default || middlewareImport;
export default proxyFunction;

export const config = {
  matcher: [
    "/hub/:path*",
    "/math/:path*",
    "/parent/:path*",
    "/admin/:path*"
  ]
};
