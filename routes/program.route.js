const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    getGrades,
    addGrade,
    getProgram,
    addProgram,
    deleteProgram,
    addProgramTheme,
    getTheme,
    deleteTheme,
    changeProgramName
} = require('../mysql/program.commands')


router.get('/users/:userid/subjects/:subjectid/grades', [
    param('userid').toInt(),
    param('subjectid').toInt(),
], [
    // middlewares
], async (req, res) => {
    const userId = req.params.userid;
    const subjectId = req.params.subjectid;
    const grades = await getGrades(userId, subjectId);

    res.status(200).json(grades);
})

router.post('/grades', [
    body('program_themes_id').isInt(),
    body('program_education_id').isInt(),
    body('user_id').isInt(),
    body('subject_group_id').isInt(),
    body('mark').isInt(),
    body('description').isLength({
        min: 2,
        max: 128
    })
], [
    // middlewares
], async (req, res) => {
    const grade = req.body;

    await addGrade(grade);
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

router.delete('/programs/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;

    await deleteProgram(id);
    res.status(200).end();
})

router.post('/programs/:id/themes', [
    param('id').toInt(),
    body('name').isLength({
        min: 2,
        max: 64
    }).withMessage('Min length of name - 2, max - 64'),
    body('type').isInt().withMessage('Only integer value')
], [
    // middlewares
], async(req, res) => {
    const id = req.params.id;
    let theme = req.body;

    theme.program_education_id = id;

    await addProgramTheme(id, theme);
    res.status(200).end();
})

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

router.get('/themes/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const theme = await getTheme(id);

    res.status(200).json(theme);
})

router.delete('/themes/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;

    await deleteTheme(id);
    res.status(200).end();
})

module.exports = router;
