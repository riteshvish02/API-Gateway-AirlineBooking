const express = require('express')
const {userController} = require('../../controllers')
const router = express.Router()

router.post('/signup',userController.createuser)
router.post('/signin',userController.signin)


module.exports = router