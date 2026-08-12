"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const axiosAuthApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER,
});

axiosAuthApi.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error),
);

axiosAuthApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

const oneWeek = 7 * 24 * 60 * 60 * 1000;
// const oneWeek = 1000;

export const postAuth = async (data: object, config = {}) =>
  await axiosAuthApi
    .post("/v1/auth", { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("accessToken", response.data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: oneWeek,
        // expires: Date.now() + oneDay,
      });

      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: oneWeek,
        // expires: Date.now() + oneDay,
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });

export const postAuthRefresh = async (data: object, config = {}) =>
  await axiosAuthApi
    .post("/v1/auth/refresh", { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("accessToken", response.data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: oneWeek,
      });

      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: oneWeek,
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });

export const logOut = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Delete the ff cookies: accessToken, refreshToken, tsAccessToken, tsRefreshToken
  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  revalidatePath("/"); // Clears cache for current page
  redirect("/login");
};
