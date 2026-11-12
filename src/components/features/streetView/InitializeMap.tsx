// import { setOptions } from "@googlemaps/js-api-loader";

// let initialized = false;

// export function initGoogleMaps() {
//   if (initialized) return;
//   initialized = true;

//   setOptions({
//     key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//   });
// }

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

export function initGoogleMaps() {
  if (!initialized) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });

    initialized = true;
  }

  return importLibrary("streetView");
}
