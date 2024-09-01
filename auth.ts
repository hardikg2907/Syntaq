import NextAuth from "next-auth";

import axios from "axios";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JwtUtils, UrlUtils } from "~/utils/constants";

const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  //@ts-ignore
  credentials: async (user, account, profile, email, credentials) => {
    return true;
  },
  //@ts-ignore
  google: async (user, account, profile, email, credentials) => {
    // console.log(account);
    try {
      const response = await axios({
        method: "post",
        url: process.env.BACKEND_URL + "/auth/social/google/",
        data: {
          access_token: account["access_token"],
          // id_token: account["id_token"],
        },
      });
      account["meta"] = response.data;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

namespace NextAuthUtils {
  export const refreshToken = async function (refreshToken: string) {
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/auth/token/refresh/",
        UrlUtils.makeUrl(process.env.BACKEND_URL!, "auth", "token", "refresh"),
        {
          refresh: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const { access, refresh } = response.data;

      // console.log(response.data);
      // console.log("refreshed tokens: ", access, refresh);
      // still within this block, return true
      return [access, refresh];
    } catch {
      return [null, null];
    }
  };
}

// export const settings: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET!,
//   session: {
//     strategy: "jwt",
//     maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
//   },
//   debug: process.env.NODE_ENV === "development",
//   providers: [
//     CredentialsProvider({
//       // name: "credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       // The data returned from this function is passed forward as the
//       // `user` variable to the signIn() and jwt() callback
//       async authorize(credentials, req) {
//         // console.log(credentials);
//         try {
//           const response = await axios({
//             url: process.env.BACKEND_URL + "/auth/login/",
//             method: "post",
//             data: {
//               username: credentials?.username,
//               password: credentials?.password,
//             },
//           });
//           const data = response.data;
//           if (data) return data;
//         } catch (error) {
//           console.error(error);
//         }
//         return null;
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }:any) {
//       if (!SIGN_IN_PROVIDERS.includes(account!.provider)) return false;
//       return SIGN_IN_HANDLERS[account?.provider]!(
//         user,
//         account,
//         profile,
//         email,
//         credentials,
//       );
//     },
//     async jwt({ token, user, account }:any) {
//       if (user && account) {
//         let backendResponse: any =
//           account.provider === "credentials" ? user : account.meta;

//         token["user"] = backendResponse.user;
//         token["access_token"] = backendResponse.access;
//         token["refresh_token"] = backendResponse.refresh;
//         token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
//         return token;
//       }

//       // user was signed in previously, we want to check if the token needs refreshing
//       // token has been invalidated, try refreshing it
//       if (JwtUtils.isJwtExpired(token.access_token as string)) {
//         // console.log(token);
//         const [newAccessToken, newRefreshToken] =
//           await NextAuthUtils.refreshToken(token.refresh_token as string);

//         if (newAccessToken && newRefreshToken) {
//           token = {
//             ...token,
//             access_token: newAccessToken,
//             refresh_token: newRefreshToken,
//             ref: getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME,
//           };

//           return token;
//         }

//         // unable to refresh tokens from DRF backend, invalidate the token
//         return {
//           ...token,
//           exp: 0,
//         };
//       }

//       // token valid
//       return token;
//     },
//     async session({ token }) {
//       // console.log("session ", session);
//       // console.log("token ", token);
//       // console.log("user", user);

//       //@ts-ignore
//       // session.accessToken = token.accessToken;
//       // return session;
//       return token;
//     },
//   },
// };
const authOptions = {
  providers: [
    CredentialsProvider({
      // name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // The data returned from this function is passed forward as the
      // `user` variable to the signIn() and jwt() callback
      async authorize(credentials, req) {
        // console.log(credentials);
        try {
          const response = await axios({
            url: process.env.BACKEND_URL + "/auth/login/",
            method: "post",
            data: {
              username: credentials?.username,
              password: credentials?.password,
            },
          });
          const data = response.data;
          if (data) return data;
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (!SIGN_IN_PROVIDERS.includes(account!.provider)) return false;
      return SIGN_IN_HANDLERS[account?.provider]!(
        user,
        account,
        profile,
        email,
        credentials,
      );
    },
    async jwt({ token, user, account }: any) {
      if (user && account) {
        let backendResponse: any =
          account.provider === "credentials" ? user : account.meta;

        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }

      // user was signed in previously, we want to check if the token needs refreshing
      // token has been invalidated, try refreshing it
      if (JwtUtils.isJwtExpired(token.access_token as string)) {
        // console.log(token);
        const [newAccessToken, newRefreshToken] =
          await NextAuthUtils.refreshToken(token.refresh_token as string);

        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            ref: getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME,
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
    async session({ token }: any) {
      // console.log("session ", session);
      // console.log("token ", token);
      // console.log("user", user);

      //@ts-ignore
      // session.accessToken = token.accessToken;
      // return session;
      return token;
    },
  },
};
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
