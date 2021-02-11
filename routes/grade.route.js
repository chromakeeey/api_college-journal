const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Оцінки
    addGrade,
    getGrades,
    getGroupGrades,
    deleteGrade
} = require('../mysql/grade.commands')

router.post('/grades', [
    body('program_themes_id').isInt(),
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