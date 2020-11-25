const QueryHelper = require('../helpers/QueryHelper');
const { connectionPool } = require('./connection')

const getGroupSubjects = (groupId) => {
    return QueryHelper.query('SELECT * FROM subject_group WHERE group_id = ?')
        .withParams(groupId)
        .then((result) => result)
        .commit();
}

const addGroupSubject = (groupSubject) => {
    return QueryHelper.query('INSERT INTO subject_group (group_id, subgroup_id, subject_id, user_id, program_education_id) VALUES (?, ?, ?, ?, ?)')
        .withParams(
            groupSubject.group_id,
            groupSubject.subgroup_id,
            groupSubject.subject_id,
            groupSubject.user_id,
            groupSubject.program_education_id
        )
        .then(result => result.insertId)
        .commit();
}

const getGroups = async () => {
    const [rows] = await connectionPool.query('SELECT * FROM `group`');

    return rows;
};

module.exports = {
    getGroupSubjects,
    addGroupSubject,
    getGroups
}