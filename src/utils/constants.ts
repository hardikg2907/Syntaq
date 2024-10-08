import jwt from "jsonwebtoken";
import { env } from "~/env";

export namespace JwtUtils {
  export const isJwtExpired = (token: string) => {
    // offset by 60 seconds, so we will check if the token is "almost expired".
    const currentTime = Math.round(Date.now() / 1000 + 60);
    const decoded = jwt.decode(token);
    // console.log(decoded);

    // console.log(`Current time + 60 seconds: ${new Date(currentTime * 1000)}`);
    // console.log(`Token lifetime: ${new Date(decoded["exp"] * 1000)}`);

    if (typeof decoded === "object" && decoded?.exp) {
      const adjustedExpiry = decoded?.exp;

      if (adjustedExpiry < currentTime) {
        // console.log("Token expired");
        return true;
      }

      // console.log("Token has not expired yet");
      return false;
    }

    // console.log('Token["exp"] does not exist');
    return true;
  };
}

export namespace UrlUtils {
  export const makeUrl = (...endpoints: string[]) => {
    let url = endpoints.reduce((prevUrl, currentPath) => {
      if (prevUrl.length === 0) {
        return prevUrl + currentPath;
      }

      return prevUrl.endsWith("/")
        ? prevUrl + currentPath + "/"
        : prevUrl + "/" + currentPath + "/";
    }, "");
    return url;
  };
}
// console.log(process.env.BACKEND_URL);
let BACKEND_API_URL: string = "";
try {
  if (window !== undefined) {
    BACKEND_API_URL = env.NEXT_PUBLIC_BACKEND_URL;
  } else {
    BACKEND_API_URL = env.BACKEND_URL;
  }
} catch (e) {
  BACKEND_API_URL = env.BACKEND_URL;
}
export { BACKEND_API_URL };
