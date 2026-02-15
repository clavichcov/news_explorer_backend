const router = require('express').Router();
const { getUserById, getUsers, createUser, 
    updateUser, updateAvatar, getUserMe } = require('../controllers/users');

router.get('/signin', getUsers);
router.get('/me', getUserMe);
//router.patch('/me/picture', updatePicture);
router.get('/:userId', getUserById);
router.post('/signup', createUser);
//router.patch('/me/avatar', updateAvatar);
//router.patch('/me', updateUser);

module.exports = router;