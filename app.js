const morgan = require("morgan");
const express = require("express");
const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const categoryRoutes = require("./src/routes/category.routes");
const subscriptionRoutes = require("./src/routes/subscription.routes");
const planRoutes = require("./src/routes/plan.routes");
const couponRoutes = require("./src/routes/coupon.routes");
const usersCouponsRoutes = require("./src/routes/users_coupons.routes");
const usersSubscrioptionsRoutes = require("./src/routes/users_subscriptions.routes");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// logger
app.use(morgan("combined"));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/plan", planRoutes);
app.use("/api/v1/users_subscriptions", usersSubscrioptionsRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/users_coupons", usersCouponsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "404",
    message: "api not found",
  });
});

app.use((error, req, res, next) => {
  console.log(`error ${error.message}`); // log the error
  const status = error.status || 400;
  // send back an easily understandable error message to the caller
  res.status(status).send(error.message);
  next();
});

module.exports = app;
