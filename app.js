const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoutes = require("./routes/user");

const postRoutes = require("./routes/post");

app.use(userRoutes);
app.use(postRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Check it's working using Postman.<h1>`);
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Task", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
