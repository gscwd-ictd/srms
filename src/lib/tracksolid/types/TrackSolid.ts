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
    todaysMileage?: number;
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

export type DeviceMileage = {
  imeis: string;
  beginTime: string;
  endTime: string;
  startRow?: number;
  pageSize?: number;
};

export type TrackSolidDeviceMileage = {
  imei: string;
  startTime: string;
  endTime: string;
  startLat: string;
  startLng: string;
  endLat: string;
  endLng: string;
  elapsed: number;
  distance: string;
  avgSpeed: string;
};

export type TrackSolidDeviceMileageList = {
  code: number;
  message: string;
  result: Array<TrackSolidDeviceMileage>;
};

export type TrackSolidRequestBody = {
  access_token: string;
  app_key: string;
  begin_time: string;
  end_time: string;
  expires_in: number;
  format: string;
  imeis: string;
  method: string;
  page_size?: number;
  sign: string;
  sign_method: string;
  start_row?: number;
  timestamp: string;
  v: string;
};
