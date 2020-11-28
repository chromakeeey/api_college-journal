const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

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

/*{
    name: '',
    int: 2434,
    float: 25.65
}*/

router.post('/test', [
    body('name').isLength({
        min: 4,
        max: 64
    }),
    body('int').isInt(),
    body('float').isFloat()
], [
    // middlewares
], async (req, res) => {
    console.log(req.body);
    res.status(200).end();
})

module.exports = router;
