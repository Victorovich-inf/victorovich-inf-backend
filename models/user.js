'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.CourseUser, {
        foreignKey: 'userId',
      })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role: DataTypes.INTEGER,
    banned: DataTypes.BOOLEAN,
    confirmationCode: DataTypes.STRING,
    vkId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
