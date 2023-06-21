import { request, response } from "express";
import { Category, Product } from "../models/index.js";

const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("user", "name")
      .populate("category", "name"),
  ]);

  res.json({
    total,
    products,
  });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  if (!product.state) {
    return res.status(400).json({
      msg: "Category is not available",
    });
  }

  res.json(product);
};

const createProduct = async (req, res = response) => {
  const { state, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name.toUpperCase() });

  if (productDB) {
    return res.status(400).json({
      msg: `Product ${productDB.name} already exists`,
    });
  }

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.userAutenticated.id,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json(product);
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  if (data.category) {
    try {
      const category = await Category.findById(data.category);

      if (!category) {
        return res.status(400).json({
          msg: `Category id invalid`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        msg: `Category id invalid`,
      });
    }
  }

  data.user = req.userAutenticated.id;

  const productName = await Product.findOne({ name: data.name });

  if (productName) {
    return res.status(400).json({
      msg: `Product ${productName.name} already exists`,
    });
  }

  const productDB = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(productDB);
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.status(500).json({
    product,
  });
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
