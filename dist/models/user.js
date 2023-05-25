'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.CourseUser, {
                foreignKey: 'userId',
            });
            User.hasMany(models.CuratorCourse, {
                foreignKey: 'userId',
            });
            User.hasMany(models.Message, {
                foreignKey: 'senderId',
            });
            User.hasMany(models.Message, {
                foreignKey: 'recipientId',
            });
            User.hasMany(models.Chat, {
                foreignKey: 'user1Id',
            });
            User.hasMany(models.Chat, {
                foreignKey: 'user2Id',
            });
            User.hasMany(models.Notification, {
                foreignKey: 'userId',
            });
            User.hasMany(models.Achievements, {
                foreignKey: 'userId',
            });
            User.hasOne(models.Subscription, {
                foreignKey: 'userId',
            });
        }
    }
    User.init({
        firstName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        lastName: DataTypes.STRING,
        role: DataTypes.INTEGER,
        banned: DataTypes.BOOLEAN,
        confirmationCode: DataTypes.STRING,
        vkId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
//# sourceMappingURL=user.js.map