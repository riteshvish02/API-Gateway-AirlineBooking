'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
const {SALT} = require('../config/serverconfig')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 20],
          msg: "Password must be between 6 and 20 characters"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeCreate(function encrypt(user){
    console.log("user bdefore",user);
       const encryptedpassword = bcrypt.hashSync(user.password,+SALT)
       user.password = encryptedpassword  
  });
  return user;
};