import { Role } from "../models/role.js";
import { User } from "../models/user.js";

const isRoleValid = async (role = "") => {
  const rolExists = await Role.findOne({ role });
  if (!rolExists) {
    throw new Error(`The role ${role} is in not valid`);
  }
};

const emailExists = async (mail = "") => {
  const emailDB = await User.findOne({ mail });
  if (emailDB) {
    throw new Error(`The mail ${mail} is already in use`);
  }
};

const userExistsById = async (id) => {
  const userDB = await User.findById(id);
  if (!userDB) {
    throw new Error(`The id ${id} isn not found in the DB`);
  }
};

export { isRoleValid, emailExists, userExistsById };
