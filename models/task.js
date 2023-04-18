'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Lesson, {
        onDelete: "CASCADE",
        foreignKey: 'lessonId',
      });
      Task.hasMany(models.Content, {
        foreignKey: 'taskId',
      })
    }
  }
  Task.init({
    name: DataTypes.STRING,
    lessonId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
