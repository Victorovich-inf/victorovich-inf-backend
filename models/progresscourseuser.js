'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgressCourseUser extends Model {
    static associate(models) {
      ProgressCourseUser.belongsTo(models.CourseUser, {
        onDelete: "CASCADE",
        foreignKey: 'courseUserId',
      });
    }
  }
  ProgressCourseUser.init({
    courseUserId: DataTypes.INTEGER,
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ProgressCourseUser',
  });
  return ProgressCourseUser;
};