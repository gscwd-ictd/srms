import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { RoleAbility } from "../../lib/authentication/types";
import { isEmpty } from "@srms/utils/isEmpty";

export const defineAbilityFor = (role: RoleAbility) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const sampleRolesSU: RoleAbility = {
    sub: "allynjosephcubero@gscwd.com",
    email: "allynjosephcubero@gscwd.com",
    apps: [
      {
        name: "2Big",
        isSuperuserAdmin: true,
        roles: [],
      },
      {
        name: "HRMS",
        isSuperuserAdmin: false,
        roles: [
          {
            slug: "viewEmployees",
            module_name: "View Employees",
          },
          {
            slug: "viewPositions",
            module_name: "View Positions",
          },
        ],
      },
    ],
    exp: 1776848672,
  };

  const sampleRolesRF: RoleAbility = {
    sub: "alexisaponesto@gscwd.com",
    email: "alexisaponesto@gscwd.com",
    apps: [
      {
        name: "2Big",
        isSuperuserAdmin: false,
        roles: [
          {
            slug: "viewSrms",
            module_name: "View SRMS Module",
          },
          {
            slug: "viewVehicleLayer",
            module_name: "View Vehicle Layer",
          },
        ],
      },
      {
        name: "HRMS",
        isSuperuserAdmin: false,
        roles: [
          {
            slug: "viewEmployees",
            module_name: "View Employees",
          },
          {
            slug: "viewPositions",
            module_name: "View Positions",
          },
        ],
      },
    ],
    exp: 1776848672,
  };

  const sampleRolesRF = role.apps.filter((app) => app.name === process.env.APP_NAME);

  console.log(sampleRolesRF);

  // if (sampleRolesRF.apps[0]. ===) {
  //   can("access", "all"); // full access
  // } else {
  //   if (!isEmpty(role)) {
  //     role.map((permission) => {
  //       can(permission.I, permission.this);
  //     });
  //   }

  // }

  return build();
};
