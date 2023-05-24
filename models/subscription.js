'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: 'userId',
      })
    }
  }
  Subscription.init({
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Subscription',
  });
  return Subscription;
};
