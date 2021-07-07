const router = require("express").Router();
const Tags = require("../models/Tags");
const TagsCnt = require("../models/TagsCnt");



//get all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tags.findById('60e4ed402df6b7d4eb78d93e')
        res.status(200).json(tags)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get all tags with count
router.get('/cnt', async (req, res) => {
    try {
        const tags = await TagsCnt.find()
        res.status(200).json(tags)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
