const {StatusCodes} = require("http-status-codes")
const info =  function(req, res, next) {
    res.status(StatusCodes.OK).json({success: true,message:"ok"});
}
module.exports = {
    info
}