import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/db/prisma";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user?.password) {
          throw new InvalidLoginError();
        }
        const passwordMatch = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordMatch) {
          throw new InvalidLoginError();
        }
        return user;
      },
    }),
  ],
});
