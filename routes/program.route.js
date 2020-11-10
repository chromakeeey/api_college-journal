const { Router } = require("express");
const router = Router();

const { program_education } = require('../json/data')

router.get('/program/get', async (req, res) => {
    try {
        const { program_education_id } = req.body
        const program = program_education.find(item => item.id === program_education_id)

        res.status(200).json(program);    
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred" });
    }
})

router.get('/program/all', async (req, res) => {
    try {
        //const { program_education_id } = req.body
        //onst program = program_education.find(item => item.id === program_education_id)

        res.status(200).json(program_education);    
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred" });
    }
})

module.exports = router;