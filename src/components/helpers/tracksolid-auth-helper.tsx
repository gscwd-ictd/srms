"use server";

import axios from "axios";
import { cookies } from "next/headers";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

axiosApi.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error),
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// POST
export const postTsAuth = async (url: string, data: object, config = {}) =>
  await axiosApi
    .post(url, { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("tsAccessToken", response?.data?.result?.accessToken, {
        httpOnly: true,
        path: "/",
      });

      (await cookies()).set("tsRefreshToken", response?.data?.result?.refreshToken, {
        httpOnly: true,
        path: "/",
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });
