const CrudRepository = require("./crud-repo")
const {user} = require("../models")

class userRepo extends CrudRepository {
   constructor(){
       super(user)
  }
}

module.exports = userRepo;