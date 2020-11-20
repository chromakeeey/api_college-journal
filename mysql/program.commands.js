const QueryHelper = require('../helpers/QueryHelper');

const getProgram = (programId) => {
    return QueryHelper.query('SELECT * FROM program_education WHERE id = ?')
        .withParams([
            programId
        ])
        .then((result) => result[0])
        .commit();
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
    addProgram
}