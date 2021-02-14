const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Добавлення нб
    addAbsent,
    // Отримання списку нб потрібного студента
    getUserAbsentList,
    // Отримання списку нб потрібної групи
    getGroupAbsentList,
    // Видалення нб потрібного студента
    delAbsent
} = require('../mysql/absent.commands')

// TODO

module.exports = router;