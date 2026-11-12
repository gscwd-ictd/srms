"use server";

import { RoleAbility } from "@srms/lib/authentication/types";
import axios from "axios";

const axiosRolesApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

axiosRolesApi.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error),
);

axiosRolesApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export const getUserRoles = async (config = {}) => {
  await axiosRolesApi
    .get(`/api/v1/user-roles`, { ...config })
    .then(async (response) => {
      return { error: false, result: response.data as RoleAbility };
    })
    .catch((error) => {
      if (error.message === "Network Error") return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response };
    });
};
