import { response } from "express";

const isAdminRole = (req, res = response, next) => {
  if (!req.userAutenticated) {
    return res.status(500).json({
      msg: "No token validated before validating role",
    });
  }

  const { role, name } = req.userAutenticated;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an admin and can't do this action`,
    });
  }

  next();
};

const userHasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.userAutenticated) {
      return res.status(500).json({
        msg: "No token validated before validating role",
      });
    }

    if (!roles.includes(req.userAutenticated.role)) {
      return res.status(401).json({
        msg: `This service require one of this roles: ${roles}`,
      });
    }

    next();
  };
};

export { isAdminRole, userHasRole };
