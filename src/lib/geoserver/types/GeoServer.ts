export type GeoserverLayer = {
  name: string;
  href: string;
};

export type DataStore = {
  dataStore: Array<GeoserverLayer>;
};

export type DataStores = {
  dataStores: DataStore;
};
