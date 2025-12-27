import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";

// Create the auth options separately
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) {
          console.error("No email provided by Google");
          return false;
        }

        console.log("Google sign-in attempt for:", email);

        // Check if user exists
        const userDb = await db.user.findFirst({
          where: {
            username: email,
          },
        });

        if (userDb) {
          console.log("User exists:", email);
          return true;
        }

        // Create new user with wallets
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = Buffer.from(keypair.secretKey).toString('base64');
        
        console.log("=== NEW USER CREATION ===");
        
        console.log("Public Key:", publicKey);
        console.log("Private Key (base64):", privateKey);
       

        try {
          await db.user.create({
            data: {
              username: email,
              name: profile?.name,
              profilePic: profile?.picture,
              password: "google-auth",
              provider: "Google",
              solWallet: {
                create: {
                  publicKey: publicKey,
                  privateKey: privateKey,
                }
              },
              inrWallet: {
                create: {
                  balance: 0
                }
              }
            }
          });
          
          console.log("User created successfully for:", email);
          return true;
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return false;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

// Create the handler
const handler = NextAuth(authOptions);

// Export GET and POST separately
export { handler as GET, handler as POST };