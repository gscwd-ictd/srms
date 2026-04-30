import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { ApplicationRole, RoleAbility } from "../../lib/authentication/types";
import { isEmpty } from "@srms/utils/isEmpty";

export const defineAbilityFor = (roles: RoleAbility) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (!roles) {
    return build(); // no permissions
  }

  const applicationRole = roles.apps.filter((app) => app.name === process.env.NEXT_PUBLIC_APP_NAME);

  const appRoles = applicationRole[0] || ({} as ApplicationRole);

  if (appRoles.isSuperuserAdmin) {
    can("access", "all"); // full access
  } else {
    if (!isEmpty(appRoles.roles)) {
      appRoles.roles.map((permission) => {
        can("access", permission.slug);
      });
    }
  }

  return build();
};
