'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Lesson, {
        foreignKey: 'courseId',
      })
      Course.hasMany(models.CourseUser, {
        foreignKey: 'courseId',
      })
      Course.hasMany(models.CuratorCourse, {
        foreignKey: 'courseId',
      })
    }
  }
  Course.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    description: DataTypes.STRING,
    dateStart: DataTypes.DATE,
    cost: DataTypes.INTEGER,
    oldPrice: DataTypes.INTEGER,
    free: DataTypes.BOOLEAN,
    public: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
