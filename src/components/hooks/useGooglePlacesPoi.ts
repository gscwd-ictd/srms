"use client";

import { useEffect } from "react";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import Bed from "../../../public/images/bed.svg";
import CircleDot from "../../../public/images/circle-dot.svg";
import GraduationCap from "../../../public/images/graduation-cap.svg";
import LandMark from "../../../public/images/landmark.svg";
import Store from "../../../public/images/store.svg";
import Trees from "../../../public/images/trees.svg";
import Utensils from "../../../public/images/utensils.svg";
import Coffee from "../../../public/images/coffee.svg";
import Hospital from "../../../public/images/hospital.svg";
import Fuel from "../../../public/images/fuel.svg";
import Car from "../../../public/images/car.svg";
import Pill from "../../../public/images/pill.svg";
import ShoppingBag from "../../../public/images/shopping-bag.svg";
import Theater from "../../../public/images/theater.svg";
import Bus from "../../../public/images/bus.svg";
import Resort from "../../../public/images/waves-horizontal.svg";
import Church from "../../../public/images/church.svg";
import House from "../../../public/images/house.svg";
import Map from "ol/Map";

export function useGooglePlacesPOI(map: Map, poiSource: VectorSource, enabled: boolean) {
  useEffect(() => {
    if (!map || !enabled) return;

    let Place: typeof google.maps.places.Place | null = null;
    let active = true;

    const isGoogleLoaded = () => typeof window !== "undefined" && window.google?.maps?.importLibrary;

    const loadGoogle = () => {
      return new Promise<void>((resolve) => {
        if (isGoogleLoaded()) return resolve();

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;

        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    const setMarkerIcon = (type: string) => {
      const t = type?.toLowerCase() || "";

      if (["food", "cafe", "bakery", "bar", "fast_food_restaurant", "restaurant"].includes(t)) {
        return Utensils.src!;
      }
      if (t === "coffee_shop") return Coffee.src!;
      if (["lodging", "hotel", "motel"].includes(t)) return Bed.src!;
      if (t.includes("store")) return Store.src!;
      if (["park", "state_park"].includes(t)) return Trees.src!;
      if (["bank", "atm", "finance"].includes(t)) return LandMark.src!;
      if (["primary_school", "secondary_school", "college", "school", "university"].includes(t))
        return GraduationCap.src!;
      if (t === "gas_station") return Fuel.src!;
      if (t === "car_dealer") return Car.src!;
      if (["hospital", "general_hospital", "dentist"].includes(t)) return Hospital.src!;
      if (t.includes("pharmacy")) return Pill.src!;
      if (["mall", "shopping_mall", "supermarket"].includes(t)) return ShoppingBag.src!;
      if (["market"].includes(t)) return ShoppingBag.src!;
      if (["event_venue", "venue", "stadium", "banquet_hall", "community_center"].includes(t))
        return Theater.src!;
      if (["bus_station", "transportation_service"].includes(t)) return Bus.src!;
      if (["resort", "resort_hotel", "water_park", "swimming_pool", "tourist_attraction"].includes(t))
        return Resort.src!;
      if (["church", "chapel", "place_of_worship"].includes(t)) return Church.src!;
      if (["service", "housing_complex", "association_or_organization", "private_guest_room"].includes(t))
        return House.src!;
      else return CircleDot.src!;
    };

    const loadPlaces = async () => {
      if (!Place || !active) return;

      const center = map.getView().getCenter();

      if (!center || center[0] == null || center[1] == null) {
        return;
      }

      const lng = Number(center[0]);
      const lat = Number(center[1]);

      try {
        const response = await Place.searchNearby({
          locationRestriction: {
            center: { lat, lng },
            radius: 2000,
          },
          includedTypes: [], // empty = search all types
          fields: ["displayName", "location", "iconBackgroundColor", "primaryType"],
        });

        if (!active) return;

        const places = response.places || [];

        poiSource.clear();

        const features = places
          .map((place) => {
            const lat = place.location?.lat?.();
            const lng = place.location?.lng?.();

            if (lat == null || lng == null) return null;

            const feature = new Feature({
              geometry: new Point([lng, lat]),
              name: place.displayName,
            });

            feature.setStyle([
              // circle background
              new Style({
                image: new CircleStyle({
                  radius: 15,
                  fill: new Fill({
                    color: place.iconBackgroundColor || "#999",
                  }),
                  stroke: new Stroke({
                    color: "#fff",
                    width: 2,
                  }),
                }),
              }),

              // icon
              new Style({
                image: new Icon({
                  src: setMarkerIcon(place.primaryType ?? ""),
                  crossOrigin: "anonymous",
                  scale: 0.7,
                }),
              }),

              // label
              new Style({
                text: new Text({
                  text: place.displayName
                    ? place.displayName?.length > 30
                      ? place.displayName.slice(0, 30) + "..."
                      : place.displayName
                    : "",

                  offsetY: 28,
                  font: "12px sans-serif",
                  fill: new Fill({ color: "#000" }),
                  stroke: new Stroke({
                    color: "#fff",
                    width: 3,
                  }),
                }),
              }),
            ]);
            return feature;
          })
          .filter((f): f is Feature<Point> => f !== null);

        poiSource.addFeatures(features);
      } catch (err) {
        console.error("Places API error:", err);
      }
    };

    loadGoogle().then(async () => {
      const lib = await google.maps.importLibrary("places");

      Place = lib.Place;

      map.on("moveend", loadPlaces);
      loadPlaces();
    });

    return () => {
      active = false;
      map.un("moveend", loadPlaces);
      poiSource.clear();
    };
  }, [map, poiSource, enabled]);
}
