const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Добавлення нової оцінки студенту
    addGrade,
    // Отримання оцінок студента за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getStudentGradesForTheme,
    // Отримання оцінок групи за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getGroupGradesForTheme,
    // Видалення оцінки по id
    deleteGrade
} = require('../mysql/grade.commands')

router.post('/grades', [
    body('program_themes_id').isInt(),
    body('user_id').isInt(),
    body('mark').isInt(),
    body('description').isLength({
        min: 2,
        max: 128
    })
], [
    // middlewares
], async (req, res) => {
    const grade = req.body;

    const insertedId = await addGrade(grade);
    res.status(200).json(insertedId);
})

router.get('/grades/program/:programId/theme_type/:themeTypeId/student/:studentId', [
    param('programId').toInt(),
    param('themeTypeId').toInt(),
    param('studentId').toInt()
], [
    // middlewares
], async (req, res) => {
    const studentId = req.params.studentId;
    const programId = req.params.programId;
    const themeTypeId = req.params.themeTypeId;
    const grades = await getStudentGradesForTheme(studentId, programId, themeTypeId);

    res.status(200).json(grades);
})

router.get('/grades/program/:programId/theme_type/:themeTypeId/group/:groupId', [
    param('programId').toInt(),
    param('themeTypeId').toInt(),
    param('groupId').toInt()
], [
    // middlewares
], async (req, res) => {
    const groupId = req.params.groupId;
    const programId = req.params.programId;
    const themeTypeId = req.params.themeTypeId;
    const grades = await getGroupGradesForTheme(groupId, programId, themeTypeId);

    res.status(200).json(grades);
})

router.delete('/grades/:gradeId', [
    param('gradeId').toInt()
], [
    // middlewares
], async (req, res) => {
    const gradeId = req.params.gradeId;

    const affectedRows =  await deleteGrade(gradeId);
    res.status(200).json(affectedRows);
})

module.exports = router;