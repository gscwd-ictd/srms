"use server";

import { TrackSolidAuth } from "@srms/lib/tracksolid/types";
import axios from "axios";
// import { cookies } from "next/headers";

// const axiosApi = axios.create();

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
export const postTsAuth = async (config = {}) => {
  // const cookieStore = await cookies();

  await axiosApi
    // .post(`http://172.20.10.59:3000/api/v1/tracksolid/access_token`, {}, { ...config })
    .post(`/api/v1/tracksolid/access_token`, {}, { ...config })
    .then(async (response) => {
      // console.log("FROM postTsAuth", response.data);
      // console.log("tsAccessToken: ", response?.data?.result?.accessToken);
      // console.log("tsRefreshToken: ", response?.data?.result?.refreshToken);
      // console.log("expires: ", response?.data?.result?.expiresIn);

      // cookieStore.set("tsAccessToken", response?.data?.result?.accessToken, {
      //   httpOnly: true,
      //   path: "/",
      //   expires: response?.data?.result?.expiresIn,
      // });

      // cookieStore.set("tsRefreshToken", response?.data?.result?.refreshToken, {
      //   httpOnly: true,
      //   path: "/",
      //   expires: response?.data?.result?.expiresIn,
      // });

      // return { error: false, result: response.data };
      return response.data;
    })
    .catch((error) => {
      console.log("ERROR SA TS: ", error);
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });
};
// try {
//   const response = await axios.post<TrackSolidAuth>(
//     `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/access_token`,
//   );
//   cookieStore.set("tsAccessToken", response?.data?.result?.accessToken);
//   cookieStore.set("refreshToken", response?.data?.result?.refreshToken);

// } catch (error) {
//   console.log(error);
//   throw error;
// }

export const setTsCookies = async (data: TrackSolidAuth) => {
  console.log("data from tracksolid:; ", data);
  // const cookieStore = await cookies();

  // console.log("tsAccessToken: ", data?.data?.result?.accessToken);
  // console.log("tsRefreshToken: ", data?.data?.result?.refreshToken);
  // console.log("expires: ", data?.data?.result?.expiresIn);

  // cookieStore.set("tsAccessToken", data?.data?.result?.accessToken, {
  //   httpOnly: true,
  //   path: "/",
  //   expires: data?.data?.result?.expiresIn,
  // });

  // cookieStore.set("tsRefreshToken", data?.data?.result?.refreshToken, {
  //   httpOnly: true,
  //   path: "/",
  //   expires: data?.data?.result?.expiresIn,
  // });
};
