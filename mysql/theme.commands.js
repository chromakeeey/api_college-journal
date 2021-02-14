const { connectionPool } = require('./connection');
const { query } = require('express');

const addTheme = async (theme) => {
    const sql = `
        INSERT INTO program_themes
        (program_education_id, name, theme_type_id)
        VALUES
        (?, ?, ?)
    `;
    const [rows] = await connectionPool.query(sql, [
        theme.program_education_id,
        theme.name,
        theme.theme_type_id
    ])
    return rows.insertId;
}

const getTheme = async (themeId) => {
    // Отримування тем потрібного типу, вказаної програми навчаня
    const themeSql = `
        SELECT theme.id, theme.program_education_id, theme.name, type.name as type
        FROM program_themes as theme, theme_types as type
        WHERE (theme.theme_type_id = type.id) AND (theme.id = ?)
    `;
    const [theme] = await connectionPool.query(themeSql, [
        themeId
    ]);
    return theme[0];
}

const deleteTheme = async (themeId) => {
    const [rows] = await connectionPool.query('DELETE FROM program_themes WHERE id = ?', themeId);
    return rows.affectedRows;
}

module.exports = {
    // Добавлення нової теми до програми навчання
    addTheme,
    // Отримання інформації про тему навчання
    getTheme,
    // Видалення теми по id
    deleteTheme
}