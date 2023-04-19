'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      Content.belongsTo(models.Task, {
        onDelete: "CASCADE",
        foreignKey: 'taskId',
      });
      Content.belongsTo(models.Lesson, {
        onDelete: "CASCADE",
        foreignKey: 'lessonId',
      });
    }
  }
  Content.init({
    content: DataTypes.JSON,
    taskId: DataTypes.INTEGER,
    lessonId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};
