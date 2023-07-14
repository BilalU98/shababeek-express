const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: ["categoryName is required !"],
  },
  imageUrl: {
    type: String,
    required: ["imageUrl is required !"],
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
