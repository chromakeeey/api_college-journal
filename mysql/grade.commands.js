const { connectionPool } = require('./connection');
const { query } = require('express');

const addGrade = async (grade) => {
    const sql = `
        INSERT INTO grade
        (program_themes_id, user_id,
        mark, description)
        VALUES
        (?, ?, ?, ?)
    `;
    const [rows] = await connectionPool.query(sql, [
        grade.program_themes_id,
        grade.user_id,
        grade.mark,
        grade.description,
    ]);
    return rows.insertId;
}

const getStudentGradesForTheme = async (studentId, programId, themeTypeId) => {
    // Отримання інфи про потрібного студента
    const studentSql = `
        SELECT id, first_name, last_name, father_name
        FROM user, student
        WHERE (user.id = student.user_id) AND (user.id = ?)
    `;
    // Отримування id тем потрібного типу, вказаної програми навчаня
    const themesSql = `
        SELECT id
        FROM program_themes
        WHERE (program_education_id = ?) AND (theme_type_id = ?)
    `;
    // Отримування оцінок користувача за відповідною тему
    const gradesSql = `
        SELECT *
        FROM grade
        WHERE (grade.user_id = ?) AND (grade.program_themes_id = ?)
    `;

    const [student] = await connectionPool.query(studentSql, [
        studentId
    ]);
    const [themes] = await connectionPool.query(themesSql, [
        programId,
        themeTypeId
    ]);
    for(theme of themes) {
        const [grades] = await connectionPool.query(gradesSql, [
            studentId,
            theme.id
        ]);
        theme.grades = grades
    }
    student[0].themes = themes
    return student[0];
}

const getGroupGradesForTheme = async (groupId, programId, themeTypeId) => {
    // Отримання id студентів вказаної групи
    const studentsSql = `
        SELECT user.id
        FROM user, student
        WHERE (user.id = student.user_id) AND (student.group_id = ?)
    `;

    const [students] = await connectionPool.query(studentsSql, [
        groupId
    ]);
    const group = [];
    for(let i=0; i<students.length; i++) {
        const studentGrades = await getStudentGradesForTheme(
            students[i].id,
            programId,
            themeTypeId
        )
        group[i] = studentGrades
    }
    return group;
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
    // Добавлення нової оцінки студенту
    addGrade,
    // Отримання оцінок студента за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getStudentGradesForTheme,
    // Отримання оцінок групи за певний тип роботи (лабораторні, практичні...)
    // по вказаній програмі навчання
    getGroupGradesForTheme,
    getGrades,
    getGroupGrades,
    deleteGrade
}