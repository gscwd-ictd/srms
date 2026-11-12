import { z } from "@hono/zod-openapi";

// Request schemas
export const SelectImeiSchema = z.object({
  imei: z.string(),
});

export const SelectImeisSchema = z.object({
  imeis: z.string(),
});

export const SelectMileageSchema = z.object({
  imeis: z.string(),
  beginTime: z.string(),
  endTime: z.string(),
  startRow: z.number().optional(),
  pageSize: z.number().optional(),
});

// Response schemas
export const SelectDevicesSchema = z.array(
  z.object({
    imei: z.string(),
    deviceName: z.string(),
    mcType: z.string(),
    mcTypeUseScope: z.string(),
    sim: z.string(),
    expiration: z.string(),
    activationTime: z.string(),
    reMark: z.string(),
    vehicleName: z.string(),
    vehicleIcon: z.string(),
    vehicleNumber: z.string(),
    vehicleModels: z.string(),
    carFrame: z.string(),
    driverName: z.string(),
    driverPhone: z.string(),
    enabledFlag: z.number(),
    engineNumber: z.string(),
    status: z.string(),
    deviceGroupId: z.string(),
    deviceGroup: z.string(),
    visible: z.boolean({
      invalid_type_error: "visible must be a boolean",
    }),
  }),
);

export const SelectDeviceDetailSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    imei: z.string(),
    deviceName: z.string(),
    mcType: z.string(),
    mcTypeUseScope: z.string(),
    sim: z.string(),
    expiration: z.string(),
    activationTime: z.string(),
    reMark: z.string(),
    vehicleName: z.string(),
    vehicleIcon: z.string(),
    vehicleNumber: z.string(),
    vehicleModels: z.string(),
    carFrame: z.string(),
    driverName: z.string(),
    driverPhone: z.string(),
    enabledFlag: z.number(),
    engineNumber: z.string(),
    iccid: z.string(),
    importTime: z.string(),
    imsi: z.string(),
    licensePlatNo: z.string(),
    vin: z.string(),
    vehicleBrand: z.string(),
    fuel_100km: z.string(),
    status: z.string(),
    user_expiration: z.string(),
    currentMileage: z.string(),
    account: z.string(),
    customerName: z.string(),
    todaysMileage: z.number(),
  }),
});

export const SelectDevicesLocationSchema = z.array(
  z.object({
    imei: z.string(),
    deviceName: z.string(),
    icon: z.string(),
    status: z.string(),
    lat: z.number(),
    lng: z.number(),
    expireFlag: z.string(),
    activationFlag: z.string(),
    posType: z.string(),
    locDesc: z.string(),
    gpsTime: z.string(),
    hbTime: z.string(),
    speed: z.string(),
    accStatus: z.string(),
    electQuantity: z.string(),
    powerValue: z.string(),
    distance: z.string(),
    gpsSignal: z.string(),
    batteryPowerVal: z.string(),
    gpsNum: z.string(),
    direction: z.string(),
    temperature: z.string(),
    trackerOil: z.string(),
    currentMileage: z.string(),
    mcType: z.string(),
    trackerOils: z.string(),
    account: z.string(),
    customerName: z.string(),
    state: z.string(),
    stateTime: z.string(),
    iccid: z.string(),
    mac: z.string(),
  }),
);

export const SelectDevicesMileageSchema = z.array(
  z.object({
    imei: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    startLat: z.string(),
    startLng: z.string(),
    endLat: z.string(),
    endLng: z.string(),
    elapsed: z.number(),
    distance: z.string(),
    avgSpeed: z.string(),
  }),
);
