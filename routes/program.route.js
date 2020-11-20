const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const { program_education } = require('../json/data')

const {
    getProgram,
    addProgram
} = require('../mysql/program.commands')

router.get('/programs/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const program = await getProgram(id)

    res.status(200).json(program);
} )

router.post('/programs', [
    body('specialty_id').isInt(),
    body('course').isInt(),
    body('subject_id').isInt(),
    body('name').isLength({
        min: 2,
        max: 128
    })
], [
    // middlewares
], async (req, res) => {
    const program = req.body;

    await addProgram(program);
    res.status(200).end();
})

module.exports = router;
