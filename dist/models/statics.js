'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Statics extends Model {
        static associate(models) {
            Statics.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: 'userId',
            });
        }
    }
    Statics.init({
        userId: DataTypes.INTEGER,
        correctlyCompletedTasks: DataTypes.INTEGER,
        winningStreak: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Statics',
    });
    return Statics;
};
//# sourceMappingURL=statics.js.map