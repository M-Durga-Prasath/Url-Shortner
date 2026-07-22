import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma from "./db.js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        // Upsert user into PostgreSQL via Prisma
        await prisma.user.upsert({
          where: {
            provider_providerId: {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
          },
        });
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        token.provider = account.provider;

        const dbUser = await prisma.user.findUnique({
          where: {
            provider_providerId: {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
