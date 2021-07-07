const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

dotenv.config();


//REGISTER
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            hash_pw: hashedPass
        })
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid Username/Password' })
    }

    if (await bcrypt.compare(req.body.password, user.hash_pw)) {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET
        )
        return res.json({ status: 'ok', data: token })
    }
    return res.json({ status: 'error', error: 'Invalid Username/PW' })

})

//User from JWT
router.get('/userFromJWT/:jwt', async (req,res) => {
    try {   
        const jwtUser = jwt.verify(req.params.jwt,process.env.JWT_SECRET)
        const user = await User.findById(jwtUser.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(502).json(err)
    }
})

module.exports = router;
