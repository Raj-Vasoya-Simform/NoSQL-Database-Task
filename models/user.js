const mongoose = require("mongoose");

// Define a schema for user data
const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    posts: {
      postItems: [
        {
          postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
          },
        },
      ],
    },
  },
  { timestamps: { type: Date, default: Date.now() } }
);

// Exporting a model for the user data
module.exports = mongoose.model("User", userSchema);
