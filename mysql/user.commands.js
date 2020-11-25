const { connectionPool } = require('./connection');

const getUsers = async () => {
    const [rows] = await connectionPool.query('SELECT * FROM user');

    return rows;
}

const getTypeAccount = async (accountType) => {
    const [rows] = await connectionPool.query('SELECT * FROM account_type WHERE id = ?', accountType);

    return rows[0];
}

const getStudentData = async (userId) => {
    const [rows] = await connectionPool.query('SELECT s.group_id, s.is_activated, g.course, g.specialty_id, g.subgroup, sp.name as specialty_name FROM student as s, `group` as g, specialty as sp WHERE s.user_id = ? AND g.id = s.group_id AND g.specialty_id = sp.id;', userId);

    return rows[0];
};

const getTeacherData = async (userId) => {
    const [rows] = await connectionPool.query('SELECT t.group_id, g.course, g.specialty_id, g.subgroup, sp.name as specialty_name FROM teacher as t, `group` as g, specialty as sp WHERE t.user_id = ? AND g.id = t.group_id AND g.specialty_id = sp.id;', userId);

    return (!rows.length) ? null : rows[0];
};

module.exports = {
    getUsers,
    getStudentData,
    getTeacherData,
    getTypeAccount
}