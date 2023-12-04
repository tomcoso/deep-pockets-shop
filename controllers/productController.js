const Product = require("../models/product");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const debug = require("debug")("deep-pockets-shop:product");

exports.inventory_index = asyncHandler(async (req, res, next) => {
  const [products, categories] = await Promise.all([
    Product.find({}, "category stock").exec(),
    Category.find({}).exec(),
  ]);

  res.render("inventory/index", {
    title: "Inventory Index",
    products,
    categories,
  });
});

exports.product_list_all = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}).sort({ name: 1 }).exec();

  // debug("all products: ", allProducts);

  res.render("inventory/product_list_all", {
    title: "All products",
    products: allProducts,
  });
});

exports.product_list_category = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ name: req.params.category }).exec();
  const productsByCategory = await Product.find({
    category: category,
  }).exec();

  debug("category: ", category);

  res.render("inventory/product_list_category", {
    title: `Shop ${req.params.category}`,
    products: productsByCategory,
    category: category,
  });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  debug("category populated: " + !!product.populated("category"));

  res.render("inventory/product_detail", {
    title: product.name,
    product,
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();

  res.render("inventory/product_form", {
    title: "Create product",
    product: undefined,
    categories: allCategories,
    errors: undefined,
  });
});

exports.product_create_post = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage("Name must only contain alphanumeric characters."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage(
      "Product description must only contain alphanumeric characters"
    ),
  body("category", "You must select a category for this product")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Invalid price value.").trim().isNumeric().escape(),
  body("stock", "Invalid stock value").trim().isNumeric().escape(),
  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      res.render("inventory/product_form", {
        title: "Product create",
        product,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await product.save();
      res.redirect(product.url);
    }
  }),
];

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).populate("category").exec(),
    Category.find({}).exec(),
  ]);

  if (!product) {
    res.redirect("/inventory/products/all");
    return;
  }

  res.render("inventory/product_form", {
    title: "Product update",
    product,
    categories: allCategories,
    errors: undefined,
  });
});

exports.product_update_post = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage("Name must only contain alphanumeric characters."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage(
      "Product description must only contain alphanumeric characters"
    ),
  body("category", "You must select a category for this product")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Invalid price value.").trim().isNumeric().escape(),
  body("stock", "Invalid stock value").trim().isNumeric().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).exec();

      res.render("inventory/product_form", {
        title: "Product update",
        product: updatedProduct,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await Product.findByIdAndUpdate(updatedProduct._id, updatedProduct, {});
      res.redirect(updatedProduct.url);
    }
  }),
];

exports.product_delete_get = asyncHandler(async (req, res, next) => {});
exports.product_delete_post = asyncHandler(async (req, res, next) => {});
