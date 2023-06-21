import { Schema, model } from "mongoose";

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "Name is mandatory"],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, state, ...category } = this.toObject();
  category.uid = _id;
  return category;
};

const Category = model("Category", CategorySchema);
export { Category };
