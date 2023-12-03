const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();

  res.render("inventory/category_list", {
    title: "Categories",
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  res.render("inventory/category_detail", {
    title: `Category: ${category.name}`,
    category,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {});
exports.category_create_post = asyncHandler(async (req, res, next) => {});

exports.category_update_get = asyncHandler(async (req, res, next) => {});
exports.category_update_post = asyncHandler(async (req, res, next) => {});

exports.category_delete_get = asyncHandler(async (req, res, next) => {});
exports.category_delete_post = asyncHandler(async (req, res, next) => {});
