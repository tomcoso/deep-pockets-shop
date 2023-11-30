const Product = require("../models/product");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

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
  const allProducts = await Product.find({}).exec();

  res.render("inventory/product_list_all", {
    title: "All products",
    products: allProducts,
  });
});

exports.product_list_category = asyncHandler(async (req, res, next) => {
  const productsByCategory = await Product.find({
    category: req.params.category,
  }).exec();

  res.render("inventory/products_list_category", {
    title: `${req.params.category}`,
    products: productsByCategory,
  });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();
  res.render("inventory/product_detail", {
    title: product.name,
    product,
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {});
exports.product_create_post = asyncHandler(async (req, res, next) => {});

exports.product_update_get = asyncHandler(async (req, res, next) => {});
exports.product_update_post = asyncHandler(async (req, res, next) => {});

exports.product_delete_get = asyncHandler(async (req, res, next) => {});
exports.product_delete_post = asyncHandler(async (req, res, next) => {});
