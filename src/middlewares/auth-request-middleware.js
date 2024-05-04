const {StatusCodes} = require("http-status-codes")
const {userService} = require('../services')
const {ErrorResponse} = require("../utils/common")
const AppError = require("../utils/errors/app-error")
function validateAuthrequest(req, res, next) {
    if(!req.body.password){
        ErrorResponse.message = "something went wrong while signing"
        ErrorResponse.error =  new AppError(["password  is not found in the incoming request"],StatusCodes.BAD_REQUEST)
        return res 
         .status(StatusCodes.BAD_REQUEST)
         .json(ErrorResponse)
    }
    if(!req.body.email){
        ErrorResponse.message = "something went wrong while signing"
        ErrorResponse.error =  new AppError(["email  is not found in the incoming request"],StatusCodes.BAD_REQUEST)
        return res 
         .status(StatusCodes.BAD_REQUEST)
         .json(ErrorResponse)
    }
    next();
}

async function checkAuth(req, res, next) {
    try {
        const response = await userService.isAuthenticated(req.headers['x-access-token'])
        if(response){
            req.user = response 
            next() //setting user id in the request object
        }
    } catch (error) {
        ErrorResponse.message = "something went wrong"
        ErrorResponse.error =  new AppError(["jwt is not found in the incoming request"],StatusCodes.BAD_REQUEST)
        return res 
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
}

module.exports = {
    validateAuthrequest,
    checkAuth
}