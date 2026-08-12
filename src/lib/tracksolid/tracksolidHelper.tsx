import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const tracksolidApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;

let refreshPromise: Promise<string> | null = null;

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const refreshTracksolidToken = async (): Promise<string> => {
  const response = await tracksolidApi.post(
    "/v1/tracksolid/refresh_token",
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.result.accessToken;
};

tracksolidApi.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    /**
     * Only handle 401 responses.
     */
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /**
     * Don't retry the same request indefinitely.
     */
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    /**
     * Don't attempt to refresh the refresh endpoint itself.
     */
    if (originalRequest.url?.includes("/v1/tracksolid/refresh_token")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /**
       * If another request is already refreshing,
       * wait for that refresh instead of creating
       * another refresh request.
       */
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshTracksolidToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      /**
       * Update Authorization/access-token header
       * for the request we're about to retry.
       */
      if (originalRequest.headers) {
        originalRequest.headers["access-token"] = newAccessToken;
      }

      /**
       * Retry the original request.
       */
      return tracksolidApi(originalRequest);
    } catch (refreshError) {
      // TrackSolid refresh token is no longer valid.
      return Promise.reject(refreshError);
    }
  },
);

export { tracksolidApi };
