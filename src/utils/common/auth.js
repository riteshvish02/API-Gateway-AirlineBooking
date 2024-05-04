const {serverconfig} = require('../../config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
function checkPassword(plainpassword,encryptedpassword) {
    try {
        return bcrypt.compareSync(plainpassword,encryptedpassword)
    } catch (error) {
        console.log(error);
        throw error;
    }

}

function createToken(input){
   try {
       return jwt.sign(input,serverconfig.JWT_SECRET,{expiresIn:serverconfig.JWT_EXPIRE})
   } catch (error) {
    console.log(error);
    throw error
   }
}
function verifyjwt(token){
    try {
    const response = jwt.verify(token,serverconfig.JWT_SECRET)
    return response
    } catch (error) {
        throw error
    }
}

module.exports = {
    checkPassword,
    createToken,
    verifyjwt
}