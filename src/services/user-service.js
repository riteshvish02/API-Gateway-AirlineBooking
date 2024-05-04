const { StatusCodes } = require("http-status-codes")
const {userRepo} = require("../repositories")
const bcrypt = require('bcrypt')
const AppError = require("../utils/errors/app-error")
const {Auth} = require("../utils/common")
const usercreateRepo = new userRepo()

async function Createuser(data){
    try {
        const user = await usercreateRepo.create(data) 
        return user
    } catch (error) {
        // console.log(error.name);
        if(error.name == "SequelizeValidationError"){
            let Explanation = [];
            error.errors.forEach(function(error) {
                Explanation.push(error.message);
            })
            throw new AppError(Explanation,StatusCodes.BAD_REQUEST)
        }
        // console.log(error);  
        throw new AppError("can't create a user object", StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

async function signin(data) {
  try {
    const user = await usercreateRepo.getuserByEmail(data.email)
    if(!user){
        throw new AppError("user not found for the given email",StatusCodes.NOT_FOUND)
    }

    const passwordmatch = Auth.checkPassword(data.password,user.password)
    if(!passwordmatch){
        throw new AppError("invalid password",StatusCodes.UNAUTHORIZED)
    }

    const jwt = Auth.createToken({id:user.id,email:user.email})
    return jwt
  } catch (error) {
    if(error instanceof AppError) throw error;
    throw new AppError('something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

async function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError("token not found",StatusCodes.UNAUTHORIZED)
        }
        const response = Auth.verifyjwt(token)
        const user = await usercreateRepo.get(response.id)
        if(!user){
            throw new AppError("user not found",StatusCodes.NOT_FOUND)
        }
        return user.id
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name === 'jsonWebTokenError'){
            throw new AppError("invalid token",StatusCodes.UNAUTHORIZED)
        }
    }
}

module.exports = {
    Createuser,
    signin,
    isAuthenticated
}
