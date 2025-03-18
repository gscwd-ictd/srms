export type FixtureUnitErrorCode =
  | "duplicate_fixture_by_year_and_type"
  | "fixture_does_not_exist"
  | "fixture_units_by_year_do_not_exist"
  | "fixture_unit_id_is_required"
  | "fixture_unit_does_not_exists";

export type FixtureUnitErrorResponse = {
  code: FixtureUnitErrorCode;
  description?: string;
  status: number;
};
