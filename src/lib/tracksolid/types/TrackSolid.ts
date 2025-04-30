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
  deviceGroupId: string;
  deviceGroup: string;
  visible?: boolean;
};

export type TrackSolidDeviceList = {
  code: number;
  message: string;
  result: Array<TrackSolidDevice>;
};

export type TrackSolidDeviceDetail = {
  code: number;
  message: string;
  result: Omit<TrackSolidDevice, "visible"> & {
    iccid: string;
    importTime: string;
    imsi: string;
    licensePlatNo: string;
    vin: string;
    vehicleBrand: string;
    fuel_100km: string;
    status: string;
    user_expiration: string;
    currentMileage: string;
    account: string;
    customerName: string;
  };
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
  mcType: string;
  trackerOils: string;
  account: string;
  customerName: string;
  state: string;
  stateTime: string;
  iccid: string;
  mac: string;
};

export type TrackSolidDeviceLocationList = {
  code: number;
  message: string;
  result: Array<TrackSolidDeviceLocation>;
};

export type DeviceImei = {
  imei: string;
};

export type DeviceImeis = {
  imeis: string;
};
