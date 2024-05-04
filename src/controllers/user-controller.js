const {StatusCodes} = require("http-status-codes")

const {userService} = require('../services')

const {ErrorResponse,SuccessResponse} = require("../utils/common")

async function createuser(req, res, next){
    try {
        const user = await userService.Createuser({
           email:req.body.email,
           password:req.body.password
        })
     SuccessResponse.data = user;
      return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        // console.log(error);
        return res
        .status(error.StatusCode)
        .json(ErrorResponse)
        
    }
}



module.exports = {
    createuser
}
