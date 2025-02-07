import { ApiClient } from "./generated";

const $api = new ApiClient({
  baseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
  headers: {
    /** Add default headers here... */
  },
});

export default $api;
