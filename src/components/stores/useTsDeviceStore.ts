import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  TrackSolidDevice,
  TrackSolidDeviceDetail,
  TrackSolidDeviceLocation,
  TrackSolidDeviceMileage,
} from "@srms/lib/tracksolid/types";

export type TsDeviceState = {
  tsDeviceList: Array<TrackSolidDevice>;
  setTsDeviceList: (tsDeviceList: Array<TrackSolidDevice>) => void;

  selectedDevice: TrackSolidDevice;
  setSelectedDevice: (selectedDevice: TrackSolidDevice) => void;

  // setDeviceVisibility: (imei: string, isChecked: boolean) => void;

  tsDeviceLocation: TrackSolidDeviceLocation;
  setTsDeviceLocation: (tsDevicesLocation: TrackSolidDeviceLocation) => void;

  tsDeviceDetails: TrackSolidDeviceDetail;
  setTsDeviceDetails: (tsDeviceDetails: TrackSolidDeviceDetail) => void;

  tsDeviceCurrentDayMileage: Array<TrackSolidDeviceMileage>;
  setTsDeviceCurrentDayMileage: (tsDeviceCurrentDayMileage: Array<TrackSolidDeviceMileage>) => void;
};

export const useTsDeviceStore = create<TsDeviceState>()(
  devtools((set) => ({
    tsDeviceList: [],
    setTsDeviceList: (tsDeviceList) => set({ tsDeviceList }),

    selectedDevice: {},
    setSelectedDevice: (selectedDevice) => set({ selectedDevice }),

    // setDeviceVisibility: (imei: string, isChecked: boolean) => set((state)),

    tsDeviceLocation: {},
    setTsDeviceLocation: (tsDeviceLocation) => set({ tsDeviceLocation }),

    tsDeviceDetails: {},
    setTsDeviceDetails: (tsDeviceDetails) => set({ tsDeviceDetails }),

    tsDeviceCurrentDayMileage: [],
    setTsDeviceCurrentDayMileage: (tsDeviceCurrentDayMileage) => set({ tsDeviceCurrentDayMileage }),
  })),
);
