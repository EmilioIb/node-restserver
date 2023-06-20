import { Schema, model } from "mongoose";

const usuarioSchema = Schema({
  name: {
    type: String,
    required: [true, "Name field is mandatory"],
  },
  mail: {
    type: String,
    required: [true, "Email filed is mandatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is mandatory"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

const User = model("User", usuarioSchema);

export { User };
