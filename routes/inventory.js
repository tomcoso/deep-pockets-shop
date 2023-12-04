const express = require("express");
const router = express.Router();

const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");

router.get("/", product_controller.inventory_index);

// PRODUCTS --------------------------------------------------------
router.get("/products/all", product_controller.product_list_all);

// products CRUD
router.get("/products/detail/:id", product_controller.product_detail);

// create
router.get("/products/create", product_controller.product_create_get);
router.post("/products/create", product_controller.product_create_post);

// update
router.get("/products/:id/update", product_controller.product_update_get);
router.post("/products/:id/update", product_controller.product_update_post);

// delete
router.get("/products/:id/delete", product_controller.product_delete_get);
router.post("/products/:id/delete", product_controller.product_delete_post);

router.get("/products/:category", product_controller.product_list_category);

// CATEGORIES ------------------------------------------------------
router.get("/category/all", category_controller.category_list);

// categories CRUD

// create
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);

// update
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);

// delete
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id", category_controller.category_detail);

module.exports = router;
