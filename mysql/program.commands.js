const { connectionPool } = require('./connection');
const { query } = require('express');

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
    // Видаленн всіх оцінок, які були поставлені за предмети по даній програмі навчання
    const [rows] = await connectionPool.query(
        "SELECT id FROM subject_group WHERE program_education_id = ?", programId)
        // console.log('subject_group_ids:')
        // console.log(rows)
    for(let obj of rows) {
        // console.log('subject_group_id:')
        // console.log(obj.id)
        await connectionPool.query(
            "DELETE FROM grade WHERE subject_group_id = ?", obj.id)
    }
    // Видалення всіх предметів даної програми
    await connectionPool.query(
        "DELETE FROM subject_group WHERE program_education_id = ?", programId)
    // Видалення всіх тем даної програми
    await connectionPool.query(
        "DELETE FROM program_themes WHERE program_education_id = ?", programId)
    // Видалення власне самої програми
    await connectionPool.query(
        "DELETE FROM program_education WHERE id = ?", programId)
    console.log(`Deleted program education with id: ${programId}`)
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
    getProgram,
    addProgram,
    deleteProgram,
    addProgramTheme,
    getTheme,
    deleteTheme,
    changeProgramName
}