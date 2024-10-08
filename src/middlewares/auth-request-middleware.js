const {StatusCodes} = require("http-status-codes")
const {userService} = require('../services')
const {ErrorResponse} = require("../utils/common")
const AppError = require("../utils/errors/app-error")
function validateAuthrequest(req, res, next) {
    console.log(req.body);
    
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
        const {token} = req.cookies
        // console.log(token);
        if(!token){
            throw new AppError("please login first to access the resource",StatusCodes.BAD_REQUEST)
        }
        const response = await userService.isAuthenticated(token)
        console.log(response);
        
        if(response){
            req.user = response 
            next() //setting user id in the request object
        }
    } catch (error) {
        console.log(error);
        ErrorResponse.message = "something went wrong"
        ErrorResponse.error =  new AppError(["jwt is not found in the incoming request"],StatusCodes.BAD_REQUEST)
        return res 
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
}

async function isAdmin(req, res, next) {

    try {
        
      
        const response = await userService.isAdmin(req.user)
        console.log(response);
        
        if(!response){
           throw new AppError("you are not an authorized person for this action",StatusCodes.UNAUTHORIZED)
        }
        next()
    } catch (error) {
        console.log("admin waalalala");
        
        ErrorResponse.message = "something went wrong"
        if(error.message == "Not able to find the resource"){
            console.log("lllelele");
            
            ErrorResponse.error =  new AppError(["you are not an authorized person for this action"],StatusCodes.UNAUTHORIZED)
        }else{
          ErrorResponse.error =  error.message
        }
       
        console.log(error.message);
        
        return res 
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
}

async function isAuthorize(req, res, next) {
    
    try {
        if (['POST', 'DELETE', 'PATCH'].includes(req.method)) {
            await isAdmin(req, res, next);
            next();
        }
       else{
           next()
       }
            
    } catch (error) {
        
        ErrorResponse.message = "something went wrong"
        ErrorResponse.error =  error.message
        console.log(error);
        return res 
        .status(StatusCodes.UNAUTHORIZED)
        .json(ErrorResponse)
        // console.log(res.status);
      
    }
}

async function isFlightStaff(req, res, next) {
    try {
        // console.log(req.user);
        const response = await userService.isFlightStaff(req.user)
        // console.log(response);
        if(!response){
           throw new AppError("you are not an authorized person for this action",StatusCodes.UNAUTHORIZED)
        }
        next()
    } catch (error) {
        ErrorResponse.message = "something went wrong"
        ErrorResponse.error =  error.message
        return res 
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
}

module.exports = {
    validateAuthrequest,
    checkAuth,
    isAdmin,
    isFlightStaff,
    isAuthorize
}