const router = require('express').Router();
const { getArticles, addArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.post('/', addArticle);
router.delete('/:_id', deleteArticle);
//router.get('/:id', getArticleById);
module.exports = router;