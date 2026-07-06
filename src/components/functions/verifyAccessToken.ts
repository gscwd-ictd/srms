import { RoleAbility } from "@srms/lib/authentication/types";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET);

export const verifyAccessToken = async (accessToken: string) => {
  try {
    const payload = await jwtVerify(accessToken, secret, {
      algorithms: ["HS256"],
    });

    console.log("original payload: ", payload.payload);

    const roles: RoleAbility = {
      sub: "allynjosephcubero@gscwd.com",
      email: "allynjosephcubero@gscwd.com",
      employeeName: "Cubero, Allyn Joseph C",
      avatar: "CUBERO.jpg",
      apps: [
        {
          name: "2Big",
          isSuperuserAdmin: false,
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

    // return payload.payload as RoleAbility;
    return roles as RoleAbility;
  } catch (error) {
    return new Error("Tampered access token or Wrong secret key." + error);
  }
};
