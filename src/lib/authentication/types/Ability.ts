export type RoleDetail = {
  slug: string;
  module_name: string;
};

export type ApplicationRole = {
  name: string;
  isSuperuserAdmin: boolean;
  roles: Array<RoleDetail>;
};

export type RoleAbility = {
  sub: string;
  email: string;
  apps: Array<ApplicationRole>;
  exp: number;
};
