'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Course, {
        onDelete: "CASCADE",
        foreignKey: 'courseId',
      });
      Lesson.hasMany(models.Task, {
        foreignKey: 'lessonId',
      })
      Lesson.hasOne(models.Content, {
        foreignKey: 'lessonId',
      })
    }
  }
  Lesson.init({
    name: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};
