import { Icon, Style } from "ol/style";
import { IconStyles } from "@srms/server/types";

export const createIconStyles = (styles: IconStyles) => {
  const iconStyle = new Style({
    image: new Icon({
      src: styles.src,
      anchor: styles.anchor,
      scale: styles.scale,
    }),
    zIndex: 999,
  });

  return { iconStyle };
};
