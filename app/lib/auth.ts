import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Session } from "next-auth";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";

export interface ExtendedSession extends Session {
  user: {
    uid: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as any).uid = token.uid;
      }
      return session;
    },

    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const user = await db.user.findFirst({
          where: {
            sub: account.providerAccountId,
          },
        });

        if (user) {
          token.uid = user.id;
        }
      }

      return token;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return false;

      const email = user.email;
      if (!email) return false;

      const existingUser = await db.user.findFirst({
        where: { username: email },
      });

      if (existingUser) return true;

      const keypair = Keypair.generate();

      await db.user.create({
        data: {
          username: email,
          name: profile?.name,
          profilePic: (profile as any)?.picture,
          provider: "Google",
          sub: account.providerAccountId,

          solWallet: {
            create: {
              publicKey: keypair.publicKey.toBase58(),
              privateKey: Buffer.from(keypair.secretKey).toString("base64"),
            },
          },

          inrWallet: {
            create: {
              balance: 0,
            },
          },
        },
      });

      return true;
    },
  },
};
