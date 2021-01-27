const { connectionPool } = require('./connection');
const { query } = require('express');

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

const addGrade = async (grade) => {
    const sql = `
        INSERT INTO grade
        (program_themes_id, program_education_id,
        user_id, mark, description, subject_group_id)
        VALUES
        (?, ?, ?, ?, ?, ?)
    `;
    const [rows] = await connectionPool.query(sql, [
        grade.program_themes_id,
        grade.program_education_id,
        grade.user_id,
        grade.mark,
        grade.description,
        grade.subject_group_id
    ]);
    return rows.insertId;
}

const getProgram = async (programId) => {
    let [program] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);
    let [themes] = await connectionPool.query('SELECT id, name, type FROM program_themes WHERE program_education_id = ?', programId);
    
    if (program.length === 0) {
        return program[0];
    }

    program[0].themes = themes;
    return program[0];
}

const addProgram = async (program) => {
    const sql = `
        INSERT INTO program_education
        (specialty, course, subject_id, name)
        VALUES
        (?, ?, ?, ?)
    `;

    const [rows] = await connectionPool.query(sql, [
        program.specialty_id,
        program.course,
        program.subject_id,
        program.name
    ]);

    return rows.insertId;
}

const deleteProgram = async (programId) => {
    const sql = `
        DELETE FROM grade WHERE subject_group_id IN (
            SELECT * FROM (
                SELECT id FROM subject_group WHERE program_education_id = ?
            ) AS p
        )
    `;

    await connectionPool.query(sql, [
        programId,
    ]);
     
    // Remove subject groups with program education id
    // Remove program themes
    // Remove program education
    await connectionPool.query('DELETE FROM subject_group WHERE program_education_id = ?', programId);
    await connectionPool.query('DELETE FROM program_themes WHERE program_education_id = ?', programId);
    await connectionPool.query('DELETE FROM program_education WHERE id = ?', programId);
}

const addProgramTheme = async (programId, theme) => {
    const sql = `
        INSERT INTO program_themes
        (program_education_id, name, type)
        VALUES
        (?, ?, ?)
    `;

    const [rows] = await connectionPool.query(sql, [
        programId,
        theme.name,
        theme.type
    ])

    return rows.insertId;
}

const getTheme = async (themeId) => {
    const [rows] = await connectionPool.query('SELECT * FROM program_themes WHERE id = ?', themeId);

    return rows[0];
}

const deleteTheme = async (themeId) => {
    const [rows] = await connectionPool.query('DELETE FROM program_themes WHERE id = ?', themeId);

    return rows.affectedRows > 0;
}

const changeProgramName = async (programId, name) => {
    const sql = `
        UPDATE program_education
        SET name = ?
        WHERE id = ?
    `;

    const [rows] = await connectionPool.query(sql, [
        name,
        programId
    ]);

    return rows.affectedRows > 0;
}

module.exports = {
    getGrades,
    getGroupGrades,
    addGrade,
    getProgram,
    addProgram,
    deleteProgram,
    addProgramTheme,
    getTheme,
    deleteTheme,
    changeProgramName
}