const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const Tags = require("../models/Tags");
const TagsCnt = require("../models/TagsCnt");



dotenv.config();

//CREATE POST
router.post("/", async (req, res) => {
  try {

    const jwtUser = jwt.verify(req.body.token, process.env.JWT_SECRET)
    const user = await User.findById(jwtUser.id)
    // let currTags = await Tags.findById("60e4ed402df6b7d4eb78d93e")
    let currTags = await Tags.findById("60e52168d2ba63b740fd0e85")


    let tempPost = {
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }

    let tagsStr = req.body.tags
    tagsStr = tagsStr.replace(/\s+/g, '')
    tagsStr = tagsStr.toLowerCase()

    if (tagsStr != '') {
      const tagsArr = tagsStr.split(',')

      tempPost.tags = tagsArr
      for (let newTag of tagsArr) {
        if (!currTags.tagsArr.includes(newTag)) {
          currTags.tagsArr.push(newTag)
          const newTagCnt = new TagsCnt({ tag: newTag, cnt: 1 })
          newTagCnt.save()
        }
        else {
          let tagForCnt = await TagsCnt.find({ tag: newTag })
          tagForCnt = tagForCnt[0]
          tagForCnt.cnt++
          const savedTagCnt = await tagForCnt.save()
        }

      }
    }

    const newPost = new Post(tempPost);

    try {
      const savedPost = await newPost.save();
      const savedTags = await currTags.save()
      user.posts.push(savedPost._id)
      const savedUser = await user.save();
      res.status(200).json({ savedPost, savedUser, savedTags });
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(502).json(err)
  }
});

//ADD COMMENT
router.post("/:id", async (req, res) => {

  try {
    const jwtUser = jwt.verify(req.body.token, process.env.JWT_SECRET)
    const user = await User.findById(jwtUser.id)
    
    const commTemp = req.body
    commTemp.firstName = user.firstName
    commTemp.lastName = user.lastName
    commTemp.email = user.email

    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    commTemp.date = date + '-' + month + '-' + year
    const newComment = new Comment(commTemp)


    let newPost = await Post.findById(req.params.id)
    newPost.comments.push(newComment)
    newPost.save()
    user.comments.push({ postId: newPost._id, commentId: newComment._id, arrayIn: newPost.comments.length - 1 })
    user.save()
    res.status(200).json(newPost)
  } catch (err) {
    res.status(500).json(err);
  }
});

//VOTE ANSWER
router.post("/voteComment/:postId/:commentId", async (req, res) => {

  try {
    const jwtUser = jwt.verify(req.body.token, process.env.JWT_SECRET)

    let post = await Post.findById(req.params.postId)

    for (comment of post.comments) {
      if (comment._id == req.params.commentId) {
        if (req.body.up == 'true') {
          comment.votes++
        } else {
          comment.votes--
        }
        break
      }
    }

    let upDown = -1
    if (req.body.up == 'true') upDown = 1

    post.markModified('comments');
    const savedPost = await post.save()

    const user = await User.findById(jwtUser.id)
    let flag = false
    for (obj of user.voted) {
      if (obj.commentId === req.params.commentId) {
        flag = true
        if (req.body.up == 'true') {
          obj.vote++
        } else {
          obj.vote--
        }
      }
    }
    if (!flag) {
      let votedElement = {
        postId: req.params.postId,
        commentId: req.params.commentId,
        vote: 1
      }
      if (req.body.up != 'true') votedElement.vote = -1
      user.voted.push(votedElement)
    }

    user.markModified('voted')
    const savedUser = await user.save()
    res.status(200).json({ savedPost, savedUser })


  } catch (err) {
    res.status(500).json(err)
  }
});



// GET POST
router.get("/:id", async (req, res) => {
  try {
    // console.log('here')
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});


//Get post by tag
router.get("/tags/:tag", async (req, res) => {
  try {
    const post = await Post.find({ tags: req.params.tag });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;