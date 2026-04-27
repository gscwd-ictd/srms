import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";

export function attachGooglePlacesPOI(map: any, poiSource: VectorSource) {
  if (!map || typeof window === "undefined") return;

  let service: google.maps.places.PlacesService | null = null;

  // Load Google Maps script once
  const loadGoogle = () => {
    return new Promise<void>((resolve) => {
      if (window.google?.maps?.places) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;

      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const initService = () => {
    const div = document.createElement("div");

    const gmap = new google.maps.Map(div, {
      center: { lat: map.getView().getCenter()[1], lng: map.getView().getCenter()[0] },
      zoom: 14,
    });

    service = new google.maps.places.PlacesService(gmap);
  };

  const loadPlaces = () => {
    if (!service) return;

    const center = map.getView().getCenter();
    if (!center) return;

    const [lng, lat] = center;

    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 1000,
        type: "restaurant",
      },
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;

        poiSource.clear();

        const features = results.map((place: any) => {
          const coords = [place.geometry.location.lng(), place.geometry.location.lat()];

          return new Feature({
            geometry: new Point(coords),
            name: place.name,
          });
        });

        poiSource.addFeatures(features);
        console.log("Places results:", results);
      },
    );
  };

  loadGoogle().then(() => {
    initService();

    map.on("moveend", loadPlaces);
    loadPlaces();
  });

  return () => {
    map.un("moveend", loadPlaces);
  };
}
