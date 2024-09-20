const {StatusCodes} = require("http-status-codes")

const {userService} = require('../services')
const {serverconfig} =  require("../config")
const {ErrorResponse,SuccessResponse} = require("../utils/common");
// const { sign } = require("jsonwebtoken");

async function createuser(req, res, next){
    try {
        console.log(req.body);
        
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
        console.log("token",token);
        

     SuccessResponse.data = token;
     const options = {
        httpOnly: true,
     }    
     
      return res.status(StatusCodes.CREATED).cookie("token",token,options).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
        .status(500)
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
