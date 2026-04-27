"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER,
});

axiosApi.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error),
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// const oneDay = 24 * 60 * 60 * 1000;

export const postAuth = async (data: object, config = {}) =>
  await axiosApi
    .post("/v1/auth", { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("accessToken", response.data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 300, // 5 minutes
        // expires: Date.now() + oneDay,
      });

      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 300, // 5 minutes
        // expires: Date.now() + oneDay,
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });

export const postAuthRefresh = async (data: object, config = {}) =>
  await axiosApi
    .post("/v1/auth/refresh", { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("accessToken", response.data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 3600, // 5 minutes
        // expires: Date.now() + oneDay,
      });

      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 3600, // 5 minutes
        // expires: Date.now() + oneDay,
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });

export const logOut = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");

  revalidatePath("/"); // Clears cache for current page
  redirect("/login");
};
