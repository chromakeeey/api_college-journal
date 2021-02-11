const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Програма навчання
    addProgram, //ok
    getProgram, //ok
    changeProgramName, //ok
    deleteProgram
} = require('../mysql/program.commands')

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

router.get('/programs/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const program = await getProgram(id)

    res.status(200).json(program);
} )

router.put('/programs/:id/name', [
    param('id').toInt(),
    body('name').isLength({
        min: 2,
        max: 64
    }).withMessage('Min length of name - 2, max - 64')
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    await changeProgramName(id, name);
    res.status(200).end();
})

router.delete('/programs/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;

    await deleteProgram(id);
    res.status(200).end();
})

module.exports = router;
