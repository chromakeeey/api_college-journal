const { connectionPool } = require('./connection');
const { query } = require('express');

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

const getProgramAndThemes = async (programId) => {
    // Отримання інформації про програму навчання
    const programSql = `
        SELECT *
        FROM program_education
        WHERE id = ?
    `;
    // Отримання всіх тем вказаної програми навчання
    const themesSql = `
        SELECT theme.id, theme.name, type.name as type
        FROM program_themes as theme, theme_types as type
        WHERE (theme.theme_type_id = type.id) AND (theme.program_education_id = ?)
    `;
    const [program] = await connectionPool.query(programSql, [
        programId
    ]);
    const [themes] = await connectionPool.query(themesSql, [
        programId
    ]);
    if (program.length === 0) {
        return program[0];
    }
    program[0].themes = themes
    return program[0];
}

const getProgramAndThemesByType = async (programId, themeTypeId) => {
    // Отримання інформації про програму навчання
    const programSql = `
        SELECT *
        FROM program_education
        WHERE id = ?
    `;
    const themesSql = `
        SELECT theme.id, theme.name, type.name as type
        FROM program_themes as theme, theme_types as type
        WHERE (theme.program_education_id = ?) AND
        ((theme.theme_type_id = type.id) AND (type.id = ?))
    `;
    const [program] = await connectionPool.query(programSql, [
        programId
    ]);
    const [themes] = await connectionPool.query(themesSql, [
        programId,
        themeTypeId
    ]);
    if (program.length === 0) {
        return program[0];
    }
    program[0].themes = themes
    return program[0];
}

const getPrograms = async (course, specialtyId) => {
    const sql = `
        SELECT id, subject_id, name, first_semester, last_semester
        FROM program_education
        WHERE (course = ?) AND (specialty_id = ?)
    `;
    const [programs] = await connectionPool.query(sql, [
        course,
        specialtyId
    ])
    return programs;
}

const getProgram = async (programId) => {
    let [program] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);
    let [themes] = await connectionPool.query('SELECT id, name, theme_type_id FROM program_themes WHERE program_education_id = ?', programId);
    
    if (program.length === 0) {
        return program[0];
    }

    program[0].themes = themes;
    return program[0];
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

module.exports = {
    // Добавлення нової програми навчання
    addProgram,
    // Отримання програми навчання і всіх її тем
    getProgramAndThemes,
    // Отримання програми навчання і всіх її тем певного типу роботи
    // (лабораторні, практичні...)
    getProgramAndThemesByType,
    getPrograms,
    getProgram,
    changeProgramName,
    deleteProgram
}