const { Router } = require("express");
const router = Router();

const {
    getUsers,
    getStudentData,
    getTeacherData,
    getTypeAccount
} = require('../mysql/user.commands')

const AccountType = {
    ADMINISTRATOR: 1,
    TEACHER: 2,
    STUDENT: 3,
    ENROLLEE: 4
};

router.get('/users', async (req, res) => {
    const users = await getUsers();

    if (!users.length) {
        res.status(204).end();
    }

    await Promise.all(users.map(async (user) => {
        const accountType = user.account_type;
        user.account_type = await getTypeAccount(accountType);

        let data = null;

        switch (user.account_type.id) {
            case AccountType.STUDENT:
                data = await getStudentData(user.id);
                user.is_activated = data.is_activated;
    
                break;
            case AccountType.TEACHER:
                data = await getTeacherData(user.id);
    
                user.is_curator = data !== null;
    
                break;
        }
    
        if (data && (accountType === AccountType.TEACHER || accountType === AccountType.STUDENT)) {
            user.group = {
                'group_id': data.group_id,
                'group_name': ''.concat(data.specialty_id, data.course, data.subgroup),
                'specialty_id': data.specialty_id,
                'specialty_name': data.specialty_name,
                'course': data.course,
                'subgroup': data.subgroup
            };
        }

        
    }))

    

    res.status(200).json(users);
});



module.exports = router