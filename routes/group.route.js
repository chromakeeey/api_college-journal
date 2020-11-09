const { Router } = require("express");
const router = Router();

const { groups, group_subjects, subjects } = require('../json/data')

router.get('/group/all', async (req, res) => {
    try {
        res.status(200).json(groups);    
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred" });
    }
})

router.post('/group/subjects', async (req, res) => {
    try {
        

        const group = req.body
        console.log(group)
        const filterSubjects = group_subjects.filter(iterator => iterator.group_id === group.id )
        let subjectWithName = []

        filterSubjects.forEach(filterSubject => {
            subjectWithName.push(
                {
                    group_subject: filterSubject,
                    subject: subjects.find(fSubject => fSubject.id === filterSubject.subject_id)
                }
            )
        })

        res.status(200).json(subjectWithName); 
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred" });
    }
})

module.exports = router