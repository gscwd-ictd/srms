"use server";

import { RoleAbility } from "@srms/lib/authentication/types";
import axios from "axios";

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

export const getUserRoles = async (config = {}) => {
  await axiosApi
    .get(`/api/v1/user-roles`, { ...config })
    .then(async (response) => {
      // console.log("from helper: ", response.data);
      return { error: false, result: response.data as RoleAbility };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });
};
