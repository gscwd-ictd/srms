import { RoleAbility } from "@srms/lib/authentication/types";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET);

export const verifyAccessToken = async (accessToken: string) => {
  try {
    const payload = await jwtVerify(accessToken, secret, {
      algorithms: ["HS256"],
    });

    return payload.payload as RoleAbility;
  } catch (error) {
    return new Error("Tampered access token or Wrong secret key." + error);
  }
};
