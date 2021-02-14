const { connectionPool } = require('./connection');
const { query } = require('express');

// TODO

module.exports = {
    // Добавлення нб
    addAbsent,
    // Отримання списку нб потрібного студента
    getUserAbsentList,
    // Отримання списку нб потрібної групи
    getGroupAbsentList,
    // Видалення нб потрібного студента
    delAbsent
}