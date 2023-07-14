require("dotenv").config();
const PORT = process.env.PORT;
const app = require("./app");
const mongoose = require("mongoose");
const DBURL = process.env.DATABASE_URL;

// connetion string fo db
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then((e) => {
    console.log("data base is connected");
  });

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, app can't start", error);
});
