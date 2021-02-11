const { connectionPool } = require('./connection');
const { query } = require('express');

const addGrade = async (grade) => {
    const sql = `
        INSERT INTO grade
        (program_themes_id, user_id,
        mark, description, subject_group_id)
        VALUES
        (?, ?, ?, ?, ?)
    `;
    const [rows] = await connectionPool.query(sql, [
        grade.program_themes_id,
        grade.user_id,
        grade.mark,
        grade.description,
        grade.subject_group_id
    ]);
    return rows.insertId;
}

const getGrades = async (userId, subjectId) => {
    const sql = `
        SELECT grade.*
        FROM grade, user, subject_group
        WHERE (grade.user_id = user.id AND grade.subject_group_id = subject_group.id) AND
        (user.id = ? AND subject_group.subject_id = ?)
    `;
    const [userGrades] = await connectionPool.query(sql, [
        userId,
        subjectId
    ]);

    let [subject] = await connectionPool.query('SELECT * FROM subject WHERE id = ?', subjectId);
    subject[0].grades = userGrades;
    return subject[0];
}

const getGroupGrades = async (groupId, subjectId) => {
    const usersSql = `
        SELECT user.id, user.first_name, user.last_name, user.father_name
        FROM user, student
        WHERE (user.id = student.user_id) AND (student.group_id = ?)
    `;
    const [users] = await connectionPool.query(usersSql, [
        groupId
    ]);

    const gradesSql = `
        SELECT grade.*
        FROM grade, user, subject_group
        WHERE (grade.user_id = user.id AND grade.subject_group_id = subject_group.id) AND
        (user.id = ? AND subject_group.subject_id = ?)
    `;
    for(user of users) {
        const [userGrades] = await connectionPool.query(gradesSql, [
            user.id,
            subjectId
        ]);
        user.grades = userGrades
    }

    let [subject] = await connectionPool.query('SELECT * FROM subject WHERE id = ?', subjectId);
    subject[0].users = users
    return subject[0];
}

const deleteGrade = async (gradeId) => {
    const [rows] = await connectionPool.query('DELETE FROM grade WHERE id = ?', gradeId);

    return rows.affectedRows > 0;
}

module.exports = {
    // Оцінки
    addGrade,
    getGrades,
    getGroupGrades,
    deleteGrade,
}