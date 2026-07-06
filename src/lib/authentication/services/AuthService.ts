import { cookies } from "next/headers";
import { UserRolesDoesNotExistError } from "../error/AuthError/UserRolesDoesNotExistError";
import { I_AuthService } from "../interfaces";
import { RoleAbility } from "../types";
// import { verifyAccessToken } from "@srms/components/functions/verifyAccessToken";
import { isEmpty } from "@srms/utils/isEmpty";

export class AuthService implements I_AuthService {
  async getUserRoles(): Promise<RoleAbility | Error | null> {
    const token = (await cookies()).get("accessToken")?.value;

    // const roles = token ? await verifyAccessToken(token) : null;

    const roles: RoleAbility = {
      sub: "allynjosephcubero@gscwd.com",
      email: "allynjosephcubero@gscwd.com",
      employeeName: "Cubero, Allyn Joseph C",
      avatar: "CUBERO.jpg",
      apps: [
        {
          name: "2Big",
          isSuperuserAdmin: false,
          // roles: [],
          roles: [
            {
              slug: "srms",
              module_name: "View SRMS Module",
            },
            {
              slug: "gis",
              module_name: "View GIS Module",
            },
            {
              slug: "fleetLayer",
              module_name: "View Fleet Layer",
            },
            {
              slug: "pipelineLayer",
              module_name: "View Pipeline Layer",
            },
            {
              slug: "waterMeterLayer",
              module_name: "View Water Meter Layer",
            },
            {
              slug: "valveLayer",
              module_name: "View Valve Layer",
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

    if (!isEmpty(roles) && !isEmpty(token)) {
      return roles;
    } else {
      throw new UserRolesDoesNotExistError(`${roles}`);
    }
  }
}
