import middlewareImport from "next-auth/middleware";

const proxyFunction = middlewareImport.default || middlewareImport;
export default proxyFunction;

export const config = {
  matcher: [
    "/math/workout/:path*",
    "/parent/:path*"
  ]
};
