"use server";

import axios from "axios";
import { cookies } from "next/headers";

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

// POST
export const postAuth = async (url: string, data: object, config = {}) =>
  await axiosApi
    .post(url, { ...data }, { ...config })
    .then(async (response) => {
      (await cookies()).set("accessToken", response.data.accessToken, {
        httpOnly: true,
        path: "/",
      });

      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        path: "/",
      });

      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });
