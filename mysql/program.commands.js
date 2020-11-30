const { connectionPool } = require('./connection')

const getProgram = async (programId) => {
    let [program] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);
    let [themes] = await connectionPool.query('SELECT * FROM program_themes WHERE program_education_id = ?', programId);
    
    if (program.length === 0) {
        return program[0];
    }

    themes.forEach(theme => delete theme.program_education_id)
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

module.exports = {
    getProgram,
    addProgram,
    addProgramTheme
}