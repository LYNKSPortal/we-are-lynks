import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { neonSql } from "./neon";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admins = await neonSql<{ id: number; username: string; email: string; password_hash: string }>`
          SELECT id, username, email, password_hash FROM admin_users WHERE username = ${credentials.username}
        `;
        const admin = admins[0];

        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password_hash);

        if (isValid) {
          return {
            id: String(admin.id),
            name: admin.username,
            email: admin.email,
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
