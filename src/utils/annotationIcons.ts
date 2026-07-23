import Pin from "../../public/images/svg-icons/pin.svg";
import Hospital from "../../public/images/svg-icons/hospital.svg";
import House from "../../public/images/svg-icons/house.svg";
import Store from "../../public/images/svg-icons/store.svg";
import Church from "../../public/images/svg-icons/church.svg";
import Wrench from "../../public/images/svg-icons/wrench.svg";
import Trees from "../../public/images/svg-icons/trees.svg";
import Fuel from "../../public/images/svg-icons/fuel.svg";
import Utensils from "../../public/images/svg-icons/utensils.svg";
import Bed from "../../public/images/svg-icons/bed.svg";
import CircleDot from "../../public/images/svg-icons/circle-dot.svg";
import LandMark from "../../public/images/svg-icons/landmark.svg";
import Theater from "../../public/images/svg-icons/theater.svg";
import ShoppingBag from "../../public/images/svg-icons/shopping-bag.svg";
import Waves from "../../public/images/svg-icons/waves-horizontal.svg";
import Pill from "../../public/images/svg-icons/pill.svg";

export const annotationIcons = [
  { value: "default", label: "Default", src: CircleDot.src },
  { value: "hospital", label: "Hospital", src: Hospital.src },
  { value: "house", label: "House", src: House.src },
  { value: "store", label: "Store", src: Store.src },
  { value: "church", label: "Church", src: Church.src },
  { value: "wrench", label: "Wrench", src: Wrench.src },
  { value: "trees", label: "Trees", src: Trees.src },
  { value: "fuel", label: "Fuel", src: Fuel.src },
  { value: "utensils", label: "Utensils", src: Utensils.src },
  { value: "bed", label: "Bed", src: Bed.src },
  { value: "pin", label: "Pin", src: Pin.src },
  { value: "landmark", label: "Landmark", src: LandMark.src },
  { value: "theater", label: "Theater", src: Theater.src },
  { value: "shopping-bag", label: "Shopping", src: ShoppingBag.src },
  { value: "waves", label: "Waves", src: Waves.src },
  { value: "pill", label: "Pill", src: Pill.src },
];

export const annotationIconMap = Object.fromEntries(annotationIcons.map((icon) => [icon.value, icon.src]));
