const { connectionPool } = require('./connection')

const getGroupSubjects = async (groupId) => {
    let [rows] = await connectionPool.query('SELECT * FROM subject_group WHERE group_id = ?', groupId)

    await Promise.all(rows.map(async (row) => {
        const [subject] = await connectionPool.query('SELECT * FROM subject WHERE id = ?', row.subject_id);
        const [user] = await connectionPool.query('SELECT id, first_name, last_name, father_name FROM user WHERE id = ?', row.user_id);

        delete row.user_id;
        delete row.subject_id;

        row.user = user[0];
        row.subject = subject[0];
    }))

    return rows;
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
    changeProgram
}