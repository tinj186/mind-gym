import NextAuthImport from "next-auth/next";
import CredentialsProviderImport from "next-auth/providers/credentials";

const NextAuth = NextAuthImport.default || NextAuthImport;
const CredentialsProvider = CredentialsProviderImport.default || CredentialsProviderImport;

const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() { return null; }
    })
  ]
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
