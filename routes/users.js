const router = require('express').Router();
const { getUserById, getUsers, getUserMe, updatePicture
         } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
//router.patch('/me/picture', updatePicture);
router.get('/:userId', getUserById);
module.exports = router;