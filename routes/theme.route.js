const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Добавлення нової теми до програми навчання
    addTheme,
    // Отримання інформації про тему навчання
    getTheme,
    // Видалення теми по id
    deleteTheme
} = require('../mysql/theme.commands')

router.post('/themes', [
    body('program_education_id').isInt(),
    body('name').isLength({
        min: 2,
        max: 64
    }).withMessage('Min length of name - 2, max - 64'),
    body('theme_type_id').isInt().withMessage('Only integer value')
], [
    // middlewares
], async(req, res) => {
    const theme = req.body;

    const insertedId = await addTheme(theme);
    res.status(200).json(insertedId);
})

router.get('/themes/:themeId', [
    param('themeId').toInt()
], [
    // middlewares
], async (req, res) => {
    const themeId = req.params.themeId;
    const theme = await getTheme(themeId);

    res.status(200).json(theme);
})

router.delete('/themes/:themeId', [
    param('themeId').toInt()
], [
    // middlewares
], async (req, res) => {
    const themeId = req.params.themeId;

    const affectedRows =  await deleteTheme(themeId);
    res.status(200).json(affectedRows);
})

module.exports = router;