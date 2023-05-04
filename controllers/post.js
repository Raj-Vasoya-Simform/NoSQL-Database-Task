const Post = require("../models/post");
const User = require("../models/user");

const path = require("path");

const fs = require("fs");

const dataFilePath = path.join(__dirname, "../", "data.json");

// Fetching dummy data from data.json file
exports.myPosts = (req, res) => {
  const userId = req.userId;
  // set the number of documents to return per page
  const perPage = 2;
  // get the page number from the query string or default to 1
  const page = parseInt(req.query.page) || 1;

  Post.find({ userId: userId })
    .skip(perPage * (page - 1))
    .limit(req.query.page ? perPage : 1000)
    .then((post) => {
      res.status(200).json({
        posts: post,
      });
    })
    .catch((err) => console.log(err));
};

// Fetching dummy data from data.json file
exports.getPosts = (req, res) => {
  // set the number of documents to return per page
  const perPage = 2;
  // get the page number from the query string or default to 1
  const page = parseInt(req.query.page) || 1;

  Post.find({})
    .skip(perPage * (page - 1))
    .limit(req.query.page ? perPage : 1000)
    .then((post) => {
      res.status(200).json({
        posts: post,
      });
    })
    .catch((err) => console.log(err));
};

// Adding a data into data.json file and in database.
exports.addPost = async (req, res) => {
  try {
    console.log(req.userId);

    // Read existing data from data.json (if it exists)
    let AllData = [];
    if (fs.existsSync(dataFilePath)) {
      AllData = JSON.parse(fs.readFileSync(dataFilePath));
    }

    // Append new data from req.body
    AllData.push({
      id: req.userId,
      ...req.body,
    });
    fs.writeFileSync(dataFilePath, JSON.stringify(AllData));
    const post = new Post({
      userId: req.userId,
      ...req.body,
    });
    let postId;
    await post
      .save()
      .then((post) => {
        postId = post;
        res.json(post);
      })
      .catch((error) => {
        console.log(error);
      });
    User.findOne({ _id: req.userId })
      .then((user) => {
        user.posts.postItems.push({ postId });
        user.save();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("err", error);
  }
};

// Fetching post having like >200
exports.likes = (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.json({ message: "It seems like you have not posted anything yet!" });
  }
  Post.aggregate([
    {
      $match: { likes: { $gte: 100 } },
    },
    {
      $sort: { likes: 1 },
    },
    {
      $group: {
        _id: "$title",
        Likes: { $sum: "$likes" },
      },
    },
  ])
    .then((result) => {
      res.status(200).json({
        TotalPosts: result.length,
        Posts: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
