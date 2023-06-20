import { Schema, model } from "mongoose";

const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "Rol is mandatory"],
  },
});

const Role = model("Role", RoleSchema);
export { Role };
