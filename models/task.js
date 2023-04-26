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
      Task.hasOne(models.Content, {
        foreignKey: 'taskId',
      })
    }
  }
  Task.init({
    name: DataTypes.STRING,
    answer: DataTypes.STRING,
    prompt: DataTypes.STRING,
    taskSolutionText: DataTypes.STRING,
    taskSolutionFile: DataTypes.STRING,
    lessonId: DataTypes.INTEGER,
    public: DataTypes.BOOLEAN,
    answerFile: DataTypes.BOOLEAN,
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
