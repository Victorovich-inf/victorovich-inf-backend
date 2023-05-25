'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('Achievements', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                correctTasks10: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                correctTasks25: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                correctTasks50: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                correctTasks100: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                correctTasksAll: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                completedTheory: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                completedCourse: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                winningStreak5: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                winningStreak10: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                winningStreak15: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                winningStreak25: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'Users',
                        key: 'id',
                        as: 'userId',
                    }
                },
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Achievements');
        });
    }
};
//# sourceMappingURL=20230523085020-create-achievements.js.map