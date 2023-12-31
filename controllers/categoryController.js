const Category = require("../models/category");
const Product = require("../models/product");

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
    } else if (req.body.password !== process.env.ADMIN_PASS) {
      res.render("inventory/category_form", {
        title: "Create category",
        errors: [{ msg: "INCORRECT PASSWORD" }],
        category: category,
      });
    } else {
      await category.save();

      res.redirect(category.url);
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (!category) {
    res.redirect("/inventory/category/all");
    return;
  }

  res.render("inventory/category_form", {
    title: "Update category",
    category: category,
    errors: undefined,
  });
});
exports.category_update_post = [
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

    const updatedCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("inventory/category_form", {
        title: "Update category",
        category: updatedCategory,
        errors: errors.array(),
      });
      return;
    } else if (req.body.password !== process.env.ADMIN_PASS) {
      res.render("inventory/category_form", {
        title: "Update category",
        category: updatedCategory,
        errors: [{ msg: "INCORRECT PASSWORD" }],
      });
    } else {
      await Category.findByIdAndUpdate(
        updatedCategory._id,
        updatedCategory,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).exec(),
  ]);

  if (!category) {
    res.redirect("/inventory/category/all");
    return;
  }

  res.render("inventory/category_delete", {
    title: "Delete category",
    category,
    products: categoryProducts,
    error: undefined,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.body.categoryid).exec(),
    Product.find({ category: req.body.categoryid }).exec(),
  ]);

  if (!category || req.body.categoryid != req.params.id) {
    res.redirect("/inventory/category/all");
    return;
  }

  if (categoryProducts.length > 0) {
    res.render("inventory/category_delete", {
      title: "Delete category",
      category,
      products: categoryProducts,
      error: undefined,
    });
    return;
  } else if (req.body.password !== process.env.ADMIN_PASS) {
    res.render("inventory/category_delete", {
      title: "Delete category",
      category,
      products: categoryProducts,
      error: { msg: "INCORRECT PASSWORD" },
    });
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/category/all");
  }
});
