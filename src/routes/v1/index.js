const express = require('express');
const router = express.Router();
const userRoutes = require("./user-route")
const {infocontroller} = require("../../controllers")
const {Authrequestmiddleware} = require('../../middlewares')
router.get('/info',
Authrequestmiddleware.checkAuth,
infocontroller.info
);
router.use('/user',userRoutes)
module.exports = router;