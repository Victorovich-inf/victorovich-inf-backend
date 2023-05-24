'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseUser extends Model {
    static associate(models) {
      CourseUser.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'userId',
      });
      CourseUser.belongsTo(models.Course, {
        onDelete: "CASCADE",
        foreignKey: 'courseId',
      });
      CourseUser.hasMany(models.ProgressCourseUser, {
        foreignKey: 'courseUserId',
      });
    }
  }
  CourseUser.init({
    courseId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    buyed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'CourseUser',
  });
  return CourseUser;
};
