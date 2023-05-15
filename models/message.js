'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'senderId',
      });
      Message.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'recipientId',
      });
      Message.belongsTo(models.Chat, {
        onDelete: "CASCADE",
        foreignKey: 'chatId',
      });
    }
  }
  Message.init({
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    chatId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};