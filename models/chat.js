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
      Chat.hasMany(models.Message, {
        foreignKey: 'chatId',
      })
    }
  }
  Chat.init({
    user1Id: DataTypes.INTEGER,
    user2Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};