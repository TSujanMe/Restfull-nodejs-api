const express=  require('express').Router();
const {protect,authorize} = require('../middlewares/auth')


const { getUsers,getUser,updateUser,deleteUser,createUser }  = require('../controllers/user');

router.use(protect)
router.use(authorize('admin'))


router.route('/').get(getUsers).post(createUser)
