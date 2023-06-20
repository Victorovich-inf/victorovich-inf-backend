'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskAnswerFile extends Model {
    static associate(models) {
      TaskAnswerFile.belongsTo(models.Task, {
        onDelete: "CASCADE",
        foreignKey: 'taskId',
      })
      TaskAnswerFile.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'userId',
      })
    }
  }
  TaskAnswerFile.init({
    taskId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    link: DataTypes.TEXT,
    wrong: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TaskAnswerFile',
  });
  return TaskAnswerFile;
};