'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: 'userId',
            });
        }
    }
    Notification.init({
        text: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
        viewed: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};
//# sourceMappingURL=notification.js.map