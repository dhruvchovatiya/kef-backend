const router = require("express").Router();
const User = require("../models/User");
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

dotenv.config();


//Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get user's votes
router.get('/votes/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        let totalVotes = 0
        for (let commElement of user.comments) {
            const post = await Post.findById(commElement.postId)
            totalVotes += post.comments[commElement.arrayIn].votes
        }
        res.status(200).json(totalVotes)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get user by jwt
router.get('/jwt/:jwt', async (req, res) => {
    try {
        const jwtUser = jwt.verify(req.params.jwt, process.env.JWT_SECRET)
        const user = await User.findById(jwtUser.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
