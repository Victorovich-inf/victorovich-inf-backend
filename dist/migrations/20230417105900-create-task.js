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
            yield queryInterface.createTable('Tasks', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING
                },
                answer: {
                    type: Sequelize.STRING
                },
                prompt: {
                    type: Sequelize.STRING
                },
                taskSolutionText: {
                    type: Sequelize.STRING
                },
                taskSolutionFile: {
                    type: Sequelize.STRING
                },
                answerFile: {
                    defaultValue: false,
                    type: Sequelize.BOOLEAN
                },
                public: {
                    defaultValue: false,
                    type: Sequelize.BOOLEAN
                },
                index: {
                    defaultValue: 0,
                    type: Sequelize.INTEGER
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                lessonId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'Lessons',
                        key: 'id',
                        as: 'lessonId',
                    }
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Tasks');
        });
    }
};
//# sourceMappingURL=20230417105900-create-task.js.map