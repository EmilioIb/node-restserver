import { request, response } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ msg: "No token in request" });
  }

  try {
    const { uid } = Jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userAutenticated = await User.findById(uid);

    if (!userAutenticated) {
      return res.status(401).json({
        msg: "Invalid token - no user",
      });
    }

    if (!userAutenticated.state) {
      return res.status(401).json({
        msg: "Invalid token",
      });
    }

    req.userAutenticated = userAutenticated;

    next();
  } catch (error) {
    console.log(token);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export { validateJWT };
