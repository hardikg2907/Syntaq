import axios from "axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { JwtUtils, UrlUtils } from "~/utils/constants";

namespace NextAuthUtils {
  export const refreshToken = async function (refreshToken: string) {
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/auth/token/refresh/",
        UrlUtils.makeUrl(process.env.BACKEND_URL!, "auth", "token", "refresh"),
        {
          refresh: refreshToken,
        },
      );

      const { access, refresh } = response.data;
      // still within this block, return true
      return [access, refresh];
    } catch {
      return [null, null];
    }
  };
}

const settings: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        // may have to switch it up a bit for other providers
        if (account?.provider === "google") {
          // extract these two tokens
          const { access_token, id_token } = account;

          // make a POST request to the DRF backend
          try {
            const response = await axios.post(
              // tip: use a seperate .ts file or json file to store such URL endpoints
              // "http://127.0.0.1:8000/api/social/login/google/",
              UrlUtils.makeUrl(
                process.env.BACKEND_URL!,
                "social",
                "login",
                account.provider,
              ),
              {
                access_token, // note the differences in key and value variable names
                id_token,
              },
            );

            // extract the returned token from the DRF backend and add it to the `user` object
            const { access_token: accessToken, refresh_token } = response.data;
            // reform the `token` object from the access token we appended to the `user` object
            token = {
              ...token,
              accessToken: accessToken,
              refreshToken: refresh_token,
            };

            return token;
          } catch (error) {
            return null;
          }
        }
      }

      // user was signed in previously, we want to check if the token needs refreshing
      // token has been invalidated, try refreshing it
      if (JwtUtils.isJwtExpired(token.accessToken as string)) {
        const [newAccessToken, newRefreshToken] =
          await NextAuthUtils.refreshToken(token.refreshToken as string);

        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60),
          };

          return token;
        }

        // unable to refresh tokens from DRF backend, invalidate the token
        return {
          ...token,
          exp: 0,
        };
      }

      // token valid
      return token;
    },
    async session({ session, user, token }) {
      // console.log("session ", session);
      // console.log("token ", token);
      // console.log("user", user);

      //@ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(settings);

export { handler as GET, handler as POST };
