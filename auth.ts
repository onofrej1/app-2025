import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
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
    Google({
      profile(profile) {
        return { ...profile, role: profile.role ?? "user", id: profile.id }
      },
      authorization: { params: { scope: "openid email profile https://mail.google.com" } },
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // @ts-ignore
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
        //user.role = "test";
        console.log(user);
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account }) {
      if(user) {
        token.role = user.role;
      }
      if(user && user.id) {
        token.id = user.id;
      }
      if (account && account.access_token) {
        token.accessToken = account.access_token;
    }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id;
      
      return {...session, token: token.accessToken };
    }
  }
});

declare module "next-auth" {
  interface Session {
    token?: string;
    user: {
      id: string;
      role?: string;      
    } & DefaultSession["user"]
  }
  interface User {
    id?: string;
    role?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    role?: string;    
  }
}

/*declare module "next-auth" {
  interface Session {
      user: User,
  };

  interface User extends DefaultUser {
      //id: string,
      role: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
      //role: string,
  }*/

/*declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}*/
