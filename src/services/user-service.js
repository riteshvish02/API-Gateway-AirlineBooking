const { StatusCodes } = require("http-status-codes")
const {userRepo} = require("../repositories")
const bcrypt = require('bcrypt')
const AppError = require("../utils/errors/app-error")
const {Auth} = require("../utils/common")
const {RoleRepo} = require("../repositories")
const usercreateRepo = new userRepo()
const roleRepo = new RoleRepo()
const {ENUMS} = require("../utils/common")
const {ADMIN,CUSTOMER,FLIGHT_COMPANY} = ENUMS.Roles
async function Createuser(data){
    try {
        const user = await usercreateRepo.create(data) 
        const role = await roleRepo.getRoleByname(CUSTOMER)
        // console.log(role);
        await user.addRole(role)
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
        // console.log(response);
        
        const user = await usercreateRepo.get(response.id)
        
        if(!user){
            throw new AppError("user not found",StatusCodes.NOT_FOUND)
        }
        return user.dataValues.id
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name === 'jsonWebTokenError'){
            throw new AppError("invalid token",StatusCodes.UNAUTHORIZED)
        }
    }
}

async function addRoletouser(data){
    try {
        const user = await usercreateRepo.get(data.id)
        if(!user){
            throw new AppError("user not found for the given id ",StatusCodes.NOT_FOUND)
        }
        const role = await roleRepo.getRoleByname(data.role)
        if(!role){  
            throw new AppError("role not found for the given name ",StatusCodes.NOT_FOUND)
        }
        await user.addRole(role)
        return user
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
async function isAdmin(id){
    try {
        const user = await usercreateRepo.get(id)
        console.log(user);
        
        if(!user){
            throw new AppError("user not found for the given id ",StatusCodes.NOT_FOUND)
        }
        const adminrole = await roleRepo.getRoleByname(ADMIN)
        console.log(adminrole);
        
        if(!adminrole){
            throw new AppError("role not found for the given name ",StatusCodes.NOT_FOUND)
        }
       const Bool =  await user.hasRole(adminrole)
        return Bool
    } catch (error) {
        console.log(error);
        if(error instanceof AppError) throw error;
        throw new AppError('something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isFlightStaff(id){
    try {
        const user = await usercreateRepo.get(id)
        if(!user){
            throw new AppError("user not found for the given id ",StatusCodes.NOT_FOUND)
        }
        const staffRole = await roleRepo.getRoleByname(FLIGHT_COMPANY)
        if(!staffRole){
            throw new AppError("role not found for the given name ",StatusCodes.NOT_FOUND)
        }
        await user.hasRole(staffRole)
        return true
    } catch (error) {
        console.log(error);
        if(error instanceof AppError) throw error;
        throw new AppError('something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

// async function isAuth(res){
//     try {
//         if(!token){
//             throw new AppError("token not found",StatusCodes.UNAUTHORIZED)
//         }
//         const response = Auth.verifyjwt(token)
//         // console.log(response);
        
//         const user = await usercreateRepo.get(response.id)
        
//         if(!user){
//             throw new AppError("user not found",StatusCodes.NOT_FOUND)
//         }
//         return user.dataValues.id
//     } catch (error) {
//         if(error instanceof AppError) throw error;
//         if(error.name === 'jsonWebTokenError'){
//             throw new AppError("invalid token",StatusCodes.UNAUTHORIZED)
//         }
//     }
// }

async function logOutUser(res){
    try {
        
        res.clearCookie("token")
        response = { message: 'SignOut successfully' }
        return response
    } catch (error) {
        // console.log(error.name);
          
        throw new AppError("something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }

}
module.exports = {
    Createuser,
    signin,
    isAuthenticated,
    addRoletouser,
    isAdmin,
    isFlightStaff,
    logOutUser
}
