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
        grade.description
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

const deleteGrade = async (gradeId) => {
    const [rows] = await connectionPool.query('DELETE FROM grade WHERE id = ?', gradeId);
    return rows.affectedRows;
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
    // Видалення оцінки по id
    deleteGrade
}