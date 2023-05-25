'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Achievements extends Model {
        static associate(models) {
            Achievements.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: 'userId',
            });
        }
    }
    Achievements.init({
        correctTasks10: DataTypes.BOOLEAN,
        correctTasks25: DataTypes.BOOLEAN,
        correctTasks50: DataTypes.BOOLEAN,
        correctTasks100: DataTypes.BOOLEAN,
        correctTasksAll: DataTypes.BOOLEAN,
        completedTheory: DataTypes.BOOLEAN,
        completedCourse: DataTypes.BOOLEAN,
        winningStreak5: DataTypes.BOOLEAN,
        winningStreak10: DataTypes.BOOLEAN,
        winningStreak15: DataTypes.BOOLEAN,
        winningStreak25: DataTypes.BOOLEAN,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Achievements',
    });
    return Achievements;
};
//# sourceMappingURL=achievements.js.map