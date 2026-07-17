import Pin from "../../public/images/pin.svg";
import Hospital from "../../public/images/hospital.svg";
import House from "../../public/images/house.svg";
import Store from "../../public/images/store.svg";
import PumpStation from "../../public/images/pump-station.svg";
import Wrench from "../../public/images/wrench.svg";
import Trees from "../../public/images/trees.svg";
import Fuel from "../../public/images/fuel.svg";
import Utensils from "../../public/images/utensils.svg";
import Bed from "../../public/images/bed.svg";

export const annotationIcons = [
  { value: "default", label: "Default", src: Pin.src },
  { value: "hospital", label: "Hospital", src: Hospital.src },
  { value: "house", label: "House", src: House.src },
  { value: "store", label: "Store", src: Store.src },
  { value: "pump-station", label: "Pump Station", src: PumpStation.src },
  { value: "wrench", label: "Wrench", src: Wrench.src },
  { value: "trees", label: "Trees", src: Trees.src },
  { value: "fuel", label: "Fuel", src: Fuel.src },
  { value: "utensils", label: "Utensils", src: Utensils.src },
  { value: "bed", label: "Bed", src: Bed.src },
];

export const annotationIconMap = Object.fromEntries(annotationIcons.map((icon) => [icon.value, icon.src]));
