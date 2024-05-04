const express = require('express')
const {userController} = require('../../controllers')
const {Authrequestmiddleware} = require('../../middlewares')
const router = express.Router()

router.post('/signup',
Authrequestmiddleware.validateAuthrequest,
userController.createuser
)

router.post('/signin',
Authrequestmiddleware.validateAuthrequest,
userController.signin
)


module.exports = router