import { request, response } from "express";
import { Category } from "../models/index.js";

const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("user", "name"),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("user", "name");

  if (!category.state) {
    return res.status(400).json({
      msg: "Category is not available",
    });
  }

  res.json(category);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${categoryDB.name} already exists`,
    });
  }

  const data = {
    name,
    user: req.userAutenticated.id,
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.userAutenticated.id;

  const categoryName = await Category.findOne({ name: data.name });

  if (categoryName) {
    return res.status(400).json({
      msg: `Category ${categoryName.name} already exists`,
    });
  }

  const categoryDB = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json(categoryDB);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.status(500).json({
    category,
  });
};

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
