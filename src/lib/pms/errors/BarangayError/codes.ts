export type BarangayErrorCode = "barangay_does_not_exist";

export type BarangayErrorResponse = {
  code: BarangayErrorCode;
  description?: string;
  status: number;
};
