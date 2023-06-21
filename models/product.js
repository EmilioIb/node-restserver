import { Schema, model } from "mongoose";

const ProductSchema = Schema({
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
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String },
  available: { type: Boolean, default: true },
  img: { type: String },
});

ProductSchema.methods.toJSON = function () {
  const { __v, _id, state, ...category } = this.toObject();
  category.uid = _id;
  return category;
};

const Product = model("Product", ProductSchema);
export { Product };
