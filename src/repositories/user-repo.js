const CrudRepository = require("./crud-repo")
const {user} = require("../models");
const { where } = require("sequelize");

class userRepo extends CrudRepository {
   constructor(){
       super(user)
  }

async getuserByEmail(email){
  const response =  await user.findOne({where:{email:email}})
  return response;
}
  
}

module.exports = userRepo;