const mongoose = require("mongoose");

// Define a schema for post data
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: String,
    likes: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { type: Date, default: Date.now() } }
);

// Create a model for the post data
module.exports = mongoose.model("Post", postSchema);
