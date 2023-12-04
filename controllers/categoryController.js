const Category = require("../models/category");

const debug = require("debug")("deep-pockets-shop:category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("inventory/category_form", {
    title: "Create category",
    errors: undefined,
    category: undefined,
  });
});
exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .isAlpha()
    .withMessage("Name cannot contain numbers")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters.")
    .isAlphanumeric()
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      debug(category);

      res.render("inventory/category_form", {
        title: "Create category",
        errors: errors.array(),
        category: category,
      });
      return;
    } else {
      await category.save();

      res.redirect(category.url);
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {});
exports.category_update_post = asyncHandler(async (req, res, next) => {});

exports.category_delete_get = asyncHandler(async (req, res, next) => {});
exports.category_delete_post = asyncHandler(async (req, res, next) => {});
