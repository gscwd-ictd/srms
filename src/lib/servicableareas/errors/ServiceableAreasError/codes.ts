export type ServiceableAreasErrorCode = "serviceable_area_does_not_exist";

export type ServiceableAreasErrorResponse = {
  code: ServiceableAreasErrorCode;
  description?: string;
  status: number;
};
