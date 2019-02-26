import Organization from "../models/Organization";

export default {
  organizations: ({ organizationId: uid }) => {
    let organization = Organization.findBy({ uid });

    return organization ? [organization] : [];
  },

  affiliationRoles: obj => obj.roles,
};