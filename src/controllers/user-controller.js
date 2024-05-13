const {StatusCodes} = require("http-status-codes")

const {userService} = require('../services')

const {ErrorResponse,SuccessResponse} = require("../utils/common");
const { sign } = require("jsonwebtoken");

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

async function signin(req, res, next){
    try {
        const token = await userService.signin({
           email:req.body.email,
           password:req.body.password   
        })
     SuccessResponse.data = token;
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


async function addrole(req, res, next){
    try {
        const user = await userService.addRoletouser({
           role:req.body.role,
           id:req.body.id 
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
    createuser,
    signin,
    addrole
}
