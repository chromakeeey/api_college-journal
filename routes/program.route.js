const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Добавлення нової програми навчання
    addProgram,
    // Отримання програми навчання і всіх її тем
    getProgramAndThemes,
    // Отримання програми навчання і всіх її тем певного типу роботи
    // (лабораторні, практичні...)
    getProgramAndThemesByType,
    getPrograms,
    getProgram,
    changeProgramName,
    deleteProgram
} = require('../mysql/program.commands')

router.post('/programs', [
    body('specialty_id').isInt(),
    body('course').isInt(),
    body('subject_id').isInt(),
    body('name').isLength({
        min: 2,
        max: 128
    }),
    body('first_semester').isInt(),
    body('last_semester').isInt()
], [
    // middlewares
], async (req, res) => {
    const program = req.body;

    const insertedId = await addProgram(program);
    res.status(200).json(insertedId);
})

router.get('/programs/:programId', [
    param('programId').toInt()
], [
    // middlewares
], async (req, res) => {
    const programId = req.params.programId;
    const program = await getProgramAndThemes(programId);

    res.status(200).json(program);
})

router.get('/programs/:programId/theme_type/:themeTypeId', [
    param('programId').toInt(),
    param('themeTypeId').toInt()
], [
    // middlewares
], async (req, res) => {
    const programId = req.params.programId;
    const themeTypeId = req.params.themeTypeId;
    const program = await getProgramAndThemesByType(programId, themeTypeId);

    res.status(200).json(program);
})

router.get('/course/:courseNumber/specialty/:specialtyId/programs', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const course = req.params.courseNumber;
    const specialtyId = req.params.specialtyId;
    const programs = await getPrograms(course, specialtyId)

    res.status(200).json(programs);
} )

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

router.delete('/programs/:programId', [
    param('programId').toInt()
], [
    // middlewares
], async (req, res) => {
    const programId = req.params.programId;

    await deleteProgram(programId);
    res.status(200).end();
})

module.exports = router;
