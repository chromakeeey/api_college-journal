const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Добавлення нової оцінки студенту
    addGrade,
    // Отримання оцінок користувача за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getUserGradesForTheme,
    // Отримання оцінок групи за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getGroupGradesForTheme,
    getGrades,
    getGroupGrades,
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

    await addGrade(grade);
    res.status(200).end();
})

router.get('/grades/program/:programId/theme_type/:themeTypeId/user/:userId', [
    param('programId').toInt(),
    param('themeTypeId').toInt(),
    param('userId').toInt()
], [
    // middlewares
], async (req, res) => {
    const userId = req.params.userId;
    const programId = req.params.programId;
    const themeTypeId = req.params.themeTypeId;
    const grades = await getUserGradesForTheme(userId, programId, themeTypeId);

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

router.get('/groups/:groupid/subjects/:subjectid/grades', [
    param('groupid').toInt(),
    param('subjectid').toInt(),
], [
    // middlewares
], async (req, res) => {
    const groupId = req.params.groupid;
    const subjectId = req.params.subjectid;
    const groupGrades = await getGroupGrades(groupId, subjectId);

    res.status(200).json(groupGrades);
})

router.delete('/grades/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;

    await deleteGrade(id);
    res.status(200).end();
})

module.exports = router;