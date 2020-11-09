const { Router } = require("express");
const router = Router();

const { subjects } = require('../json/data')

router.get('/subject/get', async (req, res) => {
    try {
        const { subject_id } = req.body
        const subject = subjects.find(subject => subject.id === subject_id)

        res.status(200).json(subject);    
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred" });
    }
})


module.exports = router