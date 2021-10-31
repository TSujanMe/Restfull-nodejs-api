const express = require('express');

const { register,login,getme,forgotPassword,resetPassword ,updatePassword,updateDetails}  = require('../controllers/auth');
const {protect} = require('../middlewares/auth')

const router  = express.Router();


router.post('/register',register )
router.post('/login',login )
router.get('/me',protect,getme )
router.put('/updatedetails',protect,updateDetails )
router.put('/updatepassword',protect,updatePassword  )
router.post('/forgotPassword',forgotPassword )
router.put('/resetPassword/:resetToken',resetPassword )


module.exports  = router;