'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, {
        onDelete: "CASCADE",
        as: 'user1',
        foreignKey: 'user1Id',
      });
      Chat.belongsTo(models.User, {
        onDelete: "CASCADE",
        as: 'user2',
        foreignKey: 'user2Id',
      });
      Chat.belongsTo(models.Course, {
        onDelete: "CASCADE",
        foreignKey: 'courseId',
      });
      Chat.hasMany(models.Message, {
        foreignKey: 'chatId',
      })
    }
  }
  Chat.init({
    user1Id: DataTypes.INTEGER,
    user2Id: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};