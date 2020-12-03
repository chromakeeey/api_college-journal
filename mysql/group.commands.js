const QueryHelper = require('../helpers/QueryHelper');
const { connectionPool } = require('./connection')

const getGroupSubjects = (groupId) => {
    return QueryHelper.query('SELECT * FROM subject_group WHERE group_id = ?')
        .withParams(groupId)
        .then((result) => result)
        .commit();
}

const addGroupSubject = async (groupSubject) => {
    const sql = `
        INSERT INTO subject_group
        (group_id, subgroup_id, subject_id, user_id)
        VALUES
        (?, ?, ?, ?)
    `

    const [rows] = await connectionPool.query(sql, [
        groupSubject.group_id,
        groupSubject.subgroup_id,
        groupSubject.subject_id,
        groupSubject.user_id
    ])

    return rows.insertId;
}

const getGroups = async () => {
    const [rows] = await connectionPool.query('SELECT * FROM `group`');

    return rows;
};

const changeProgram = async (id, programEducationId) => {
    const sql = `
        UPDATE subject_group
        SET program_education_id = ?
        WHERE id = ?
    `;

    const [rows] = await connectionPool.query(sql, [
        programEducationId,
        id
    ]);

    return rows.affectedRows > 0;
}

module.exports = {
    getGroupSubjects,
    addGroupSubject,
    getGroups,
    changeProgram,
}