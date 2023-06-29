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
      ProgressCourseUser.belongsTo(models.Course, {
        onDelete: "CASCADE",
        foreignKey: 'courseId',
      });
      ProgressCourseUser.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'userId',
      });
    }
  }
  ProgressCourseUser.init({
    courseUserId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ProgressCourseUser',
  });
  return ProgressCourseUser;
};