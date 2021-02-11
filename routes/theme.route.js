const { Router } = require("express");
const router = Router();

const { body, param } = require("express-validator");

const {
    // Теми програми навчання
    addTheme,
    getTheme,
    deleteTheme
} = require('../mysql/theme.commands')

router.post('/programs/:id/themes', [
    param('id').toInt(),
    body('name').isLength({
        min: 2,
        max: 64
    }).withMessage('Min length of name - 2, max - 64'),
    body('theme_type_id').isInt().withMessage('Only integer value')
], [
    // middlewares
], async(req, res) => {
    const id = req.params.id;
    let theme = req.body;

    theme.program_education_id = id;

    await addTheme(id, theme);
    res.status(200).end();
})

router.get('/themes/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;
    const theme = await getTheme(id);

    res.status(200).json(theme);
})

router.delete('/themes/:id', [
    param('id').toInt()
], [
    // middlewares
], async (req, res) => {
    const id = req.params.id;

    await deleteTheme(id);
    res.status(200).end();
})

module.exports = router;