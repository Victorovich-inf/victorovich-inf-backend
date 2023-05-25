'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CuratorCourse extends Model {
        static associate(models) {
            CuratorCourse.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: 'userId',
            });
            CuratorCourse.belongsTo(models.Course, {
                onDelete: "CASCADE",
                foreignKey: 'courseId',
            });
        }
    }
    CuratorCourse.init({
        courseId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'CuratorCourse',
    });
    return CuratorCourse;
};
//# sourceMappingURL=curatorcourse.js.map