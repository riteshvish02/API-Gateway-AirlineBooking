const { StatusCodes } = require("http-status-codes")
const {userRepo} = require("../repositories")

const AppError = require("../utils/errors/app-error")
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

module.exports = {
    Createuser
}
