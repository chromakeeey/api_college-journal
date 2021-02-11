const { connectionPool } = require('./connection');
const { query } = require('express');

const addTheme = async (programId, theme) => {
    const sql = `
        INSERT INTO program_themes
        (program_education_id, name, theme_type_id)
        VALUES
        (?, ?, ?)
    `;
    const [rows] = await connectionPool.query(sql, [
        programId,
        theme.name,
        theme.theme_type_id
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

module.exports = {
    // Теми програми навчання
    addTheme,
    getTheme,
    deleteTheme
}