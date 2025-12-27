import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from 

// signup / and sigin with google 
const handler = NextAuth({
     providers: [
        GoogleProvider ({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
     ],
     callbacks: {
        async signIn({user, account, profile, email, credentials}) {
           if (account?.provider === "google") {
             const email = user.email;
             if (!email){
                return false
             }

             const userDb = await db.user.findfirst({
               
             })
           
        }
         return false
     },

     } 
})

export { handler as GET, handler as POST}