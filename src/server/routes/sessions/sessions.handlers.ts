import { AppRouteHandler } from "@srms/server/types/appTypes";
import { SetOIDCParams } from "./sessions.routes";
import { setCookie } from "hono/cookie";
import { $oidcClient } from "@srms/server/app";

export const setOdicParams: AppRouteHandler<SetOIDCParams> = async (c) => {
  const { url, codeVerifier, state, nonce } = await $oidcClient.createAuthorizationURL();

  if (codeVerifier) {
    setCookie(c, "code_verifier", codeVerifier, {
      httpOnly: true,
    });
  }

  if (state) {
    setCookie(c, "state", state, {
      httpOnly: true,
    });
  }

  if (nonce) {
    setCookie(c, "nonce", nonce, {
      httpOnly: true,
    });
  }

  return c.json({ url: url.href });
};
