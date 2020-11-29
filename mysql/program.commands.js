//const QueryHelper = require('../helpers/QueryHelper');
const { connectionPool } = require('./connection')

/*const getProgram = async (programId) => {
    const [rows] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);

    return rows[0];
}*/

const getProgram = async (programId) => {
    // Отримання інфи з бази
    const [progInfo] = await connectionPool.query('SELECT * FROM program_education WHERE id = ?', programId);
    const [themInfo] = await connectionPool.query('SELECT * FROM program_themes WHERE program_education_id = ?', programId);
    
    console.log('Program education:');
    console.log(progInfo);
    console.log('Program themes:');
    console.log(themInfo.length);
    console.log(themInfo);
    // Обєкт для збереження результату
    let progAndThemes = {};
    // Формування об'єкта
    progAndThemes.id = progInfo[0].id;
    progAndThemes.name = progInfo[0].name;
    progAndThemes.specialty = progInfo[0].specialty;
    progAndThemes.course = progInfo[0].course;
    progAndThemes.subject_id = progInfo[0].subject_id;
    progAndThemes.themes = [];
    // Добавлення тем
    for(let i=0; i<themInfo.length; i++) {
        let tmpThemes = {};
        tmpThemes.id = themInfo[i].id;
        tmpThemes.name = themInfo[i].name;
        tmpThemes.type = themInfo[i].type;
        progAndThemes.themes[i] = tmpThemes;
    }
    return progAndThemes;
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