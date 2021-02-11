const { Router } = require("express");
const router = Router();

const { body, param } = require('express-validator')

const {
    getGroupSubjectsList,
    getGroupSubjects,
    addGroupSubject,
    getGroups,
    changeProgram
} = require('../mysql/group.commands')

router.get('/groups/:id/subjects/list', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const groupId = req.params.id;
    const groupSubjects = await getGroupSubjectsList(groupId);

    res.status(200).json(groupSubjects);
})

router.get('/groups/:id/subjects', [
    param('id').toInt()
], [
   // middlewares
], async (req, res) => {
    const groupId = req.params.id;
    const subjects = await getGroupSubjects(groupId)

    res.status(200).json(subjects);
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

router.post('/groups/:id/subjects', [
    param('id').toInt(),

    body('subgroup_id').isInt().withMessage('Only integer value'),
    body('subject_id').isInt().withMessage('Only integer value'),
    body('user_id').isInt().withMessage('Only integer value')

], [
    // middlewares
], async (req, res) => {
    const groupId = req.params.id;
    const body = req.body;

    body.group_id = groupId;

    await addGroupSubject(body);
    res.status(200).end();
})

router.put('/groups/subjects/:id/program-education', [
    param('id').toInt(),
    body('program_education_id').isInt().withMessage('Only integer value')
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const program_education_id = req.body.program_education_id;

    await changeProgram(id, program_education_id);
    res.status(200).end();
})

module.exports = router