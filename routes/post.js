const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post")
const requireLogin = require("../middleware/requiredLogin");

router.get('/allpost', requireLogin,(req, res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Please add all the fields" });
  }
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post.save()
    .then((savedPost) => {
        res.json({message : "Post created Successfully"})
    })
    .catch(err=>{
        console.log(err)
    })
});

router.get("/postbyme", requireLogin, (req, res)=>{
  Post.find({postedBy: req.user._id})
  .populate("postedBy","name")
  .then(mypost=>{
    res.json({mypost})
  })
  .catch(err=>{
    console.log(err)
  })
})

module.exports = router;
