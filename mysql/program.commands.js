//const QueryHelper = require('../helpers/QueryHelper');
const { connectionPool } = require('./connection')

const getProgram = async (programId) => {
    const [rows] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);

    return rows[0];
}
//
const getProgramThemes = async (programId) => {
    const [rows] = await connectionPool.query('SELECT pe.name, pe.specialty, pe.course, pt.name, pt.type, FROM program_education AS pe, program_themes AS pt WHERE (pe.id = pt.program_education_id) AND (pe.id = ?)', programId);

    return rows[0];
}

const addProgram = (program) => {
    return QueryHelper.query('INSERT INTO program_education (specialty, course, subject_id, name) VALUES (?, ?, ?, ?)')
        .withParams(
            program.specialty_id,
            program.course,
            program.subject_id,
            program.name
        )
        .then((result) => result.insertId)
        .commit();
}

module.exports = {
    getProgram,
    getProgramThemes,//
    addProgram
}