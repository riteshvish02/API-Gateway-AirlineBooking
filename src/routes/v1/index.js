const express = require('express');
const router = express.Router();
const userRoutes = require("./user-route")
const {infocontroller} = require("../../controllers")

router.get('/info',infocontroller.info);
router.use('/user',userRoutes)
module.exports = router;