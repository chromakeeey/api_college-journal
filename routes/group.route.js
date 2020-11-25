const { Router } = require("express");
const router = Router();

const { body, param } = require('express-validator')

const {
    getGroupSubjects,
    addGroupSubject,
    getGroups
} = require('../mysql/group.commands')

router.get('/groups/:id/subjects', [
    param('id').toInt()
], [
   // middlewares
], async (req, res) => {
    const groupId = req.params.id;
    const subjects = await getGroupSubjects(groupId)

    console.log(subjects)
    res.status(200).json(subjects);
})

router.post('/groups/subjects', [
    body('group_id').isInt(),
    body('subgroup_id').isInt(),
    body('subject_id').isInt(),
    body('user_id').isInt(),
    body('program_education_id').isInt()
], [
    // middlewares
], async (req, res) => {
    const groupSubject = req.body;

    await addGroupSubject(groupSubject);
    res.status(200).end();
})

router.get('/groups', async (req, res) => {
    const groups = await getGroups();

    if (!groups.length) {
        res.status(204).end();
    }

    groups.forEach(group => {
        group.group_name = ''.concat(group.specialty_id, group.course, group.subgroup);
    });

    res.status(200).json(groups);
});



module.exports = router