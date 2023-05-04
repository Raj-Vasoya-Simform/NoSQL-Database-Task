const path = require("path");

const express = require("express");

const postController = require("../controllers/post");

const auth = require("../middleware/auth");

const router = express.Router();

// To  fetch users Posts
router.get("/myposts", auth, postController.myPosts);

// To fetch all posts
router.get("/posts", postController.getPosts);

// To add Post
router.post("/post", auth, postController.addPost);

// To get Post having likes >200
router.get("/likes", auth, postController.likes);

module.exports = router;
