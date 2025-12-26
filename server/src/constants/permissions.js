const { ROLES } = require("./roles");
const { ACTIONS } = require("./actions");
const { RESOURCES } = require("./resources");

const permissions = {
  [ROLES.ADMIN]: {
    [RESOURCES.USER]: [ACTIONS.READ],
    [RESOURCES.POST]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
      ACTIONS.PUBLISH,
      ACTIONS.ARCHIVE,
    ],
    [RESOURCES.PROPERTY]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.LEAD]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.PAGE]: [ACTIONS.READ],
  },

  [ROLES.SUPER_ADMIN]: {
    "*": ["*"],
  },
};

module.exports = { permissions };
