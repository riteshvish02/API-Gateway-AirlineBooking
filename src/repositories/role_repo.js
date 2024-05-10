const CrudRepository = require("./crud-repo")
const {Role} = require("../models");
const { where } = require("sequelize");

class RoleRepo extends CrudRepository {
   constructor(){
       super(Role)
  }

async getRoleByname(name){
  const response =  await Role.findOne({where:{name:name}})
  return response;
}
  
}

module.exports = RoleRepo;