const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    discount: String,
    description: String,
    image: String,
    freeDelivery: Boolean,
    category: String,
    color: String,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;