export type TrackSolidTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export type TrackSolidAuth = {
  code: number;
  message: string;
  result: {
    appKey: string;
    account: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    time: string;
  };
};

export type TrackSolidDevice = {
  imei: string;
  deviceName: string;
  mcType: string;
  mcTypeUseScope: string;
  sim: string;
  expiration: string;
  activationTime: string;
  reMark: string;
  vehicleName: string;
  vehicleIcon: string;
  vehicleNumber: string;
  vehicleModels: string;
  carFrame: string;
  driverName: string;
  driverPhone: string;
  enabledFlag: number;
  engineNumber: string;
  status: string;
  visible?: boolean;
};

export type TrackSolidDeviceList = {
  code: number;
  message: string;
  result: Array<TrackSolidDevice>;
};

export type TrackSolidDeviceLocation = {
  imei: string;
  deviceName: string;
  icon: string;
  status: string;
  posType: string;
  lat: number;
  lng: number;
  hbTime: string;
  accStatus: string;
  gpsSignal: string;
  powerValue: string;
  batteryPowerVal: string;
  speed: string;
  gpsNum: string;
  gpsTime: string;
  direction: string;
  activationFlag: string;
  expireFlag: string;
  electQuantity: string;
  locDesc: string;
  distance: string;
  temperature: string;
  trackerOil: string;
  currentMileage: string;
};

export type TrackSolidDeviceLocationList = {
  code: number;
  message: string;
  result: Array<TrackSolidDeviceLocation>;
};
