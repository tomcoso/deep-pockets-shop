#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Product = require("./models/product");

const categories = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(index, name, description, category, price, stock) {
  const product = new Product({
    name,
    description,
    category,
    price,
    stock,
  });

  await product.save();
  products[index] = product;
  console.log(`Added product: ${name} ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Potions",
      "Magical beverages for everyone. Every effect you can imagine!"
    ),
    categoryCreate(
      1,
      "Scrolls",
      "Magical scrolls that will accomplish whatever you want. As long as you have the coin and the skill."
    ),
    categoryCreate(
      2,
      "Tomes",
      "You want to learn new magic? Tomes is the way to go."
    ),
    categoryCreate(
      3,
      "Wands",
      "These wands will make your spells easier to cast and stronger!"
    ),
    categoryCreate(
      4,
      "Charms",
      "Charms are the best way to enhance yourself or trick others. Subtle effects, but quite powerful."
    ),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "Oak Wand",
      "This Oak Wand is perfect for beginners",
      categories[3],
      80,
      13
    ),
    productCreate(
      1,
      "Wand of the 7 Foxes",
      "It is rumored that this wand is crafted by a hidden society of foxes deep in the forest. No one has ever seen them, but sometimes these wands can be found on the darkest entrails of the woods.",
      categories[3],
      700,
      3
    ),
    productCreate(
      2,
      "Healing Potion",
      "Heals non-lethal wounds within 30 minutes.",
      categories[0],
      15,
      243
    ),
    productCreate(
      3,
      "Mana Potion",
      "Restores your mana. Suitable for professional mages.",
      categories[0],
      10,
      189
    ),
    productCreate(
      4,
      "Scroll of Fireball",
      "Casts a fireball at the direction your casting hand is pointing. Do not use in closed spaces",
      categories[1],
      210,
      17
    ),
    productCreate(
      5,
      "Tome of Telekinetic Magic (Begginer to Intermediate)",
      "This tome walks you through the fundamentals of Telekinetic Magic.",
      categories[2],
      230,
      70
    ),
    productCreate(
      6,
      "Advanced Tome of Illusory Weaving",
      "One of the most advanced wells of knowledge regarding Illusory Weaving. This tome is a must-have if you want to stand highest among Illusion Mages. This knowledge belongs to the occult, as the price reflects.",
      categories[2],
      1800,
      2
    ),
    productCreate(
      7,
      "Charm of Flashing",
      "This charm will make the wearer slightly faster and more nimble. Do not wear if participating in sport events",
      categories[4],
      80,
      55
    ),
    productCreate(
      8,
      "Lucky Charm",
      "It is said this charm will make you slightly luckier. We don't know how it is made, just that it involves the limbs of people who hate rabbits.",
      categories[4],
      180,
      34
    ),
  ]);
}
