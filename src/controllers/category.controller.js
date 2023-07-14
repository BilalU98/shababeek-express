const Category = require("../models/category.model");

exports.getAllCategories = async (req, res, next) => {
  try {
    // create new user
    console.log("Asd");
    const categories = await Category.find();

    res.status(200).json({
      status: "success",
      length: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.addOneCategory = async (req, res, next) => {
  try {
    // create new user
    const { categoryName, imageUrl } = req.body;
    if (!categoryName) {
      res.status(400).json({
        status: "failed",
        message: "provide category name",
      });

      return;
    }

    const category = await Category.create({ categoryName, imageUrl });

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    // create new user
    const { categoryName, imageUrl, categoryId } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.removeOneCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        status: "failed",
        message: "provide category id",
      });

      return;
    }

    const category = await Category.findByIdAndRemove(id);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};
