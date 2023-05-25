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
            yield queryInterface.createTable('Messages', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                message: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                image: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                senderId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'Users',
                        key: 'id',
                        as: 'senderId',
                    }
                },
                recipientId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'Users',
                        key: 'id',
                        as: 'recipientId',
                    }
                },
                chatId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'Chats',
                        key: 'id',
                        as: 'chatId',
                    }
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
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
            yield queryInterface.dropTable('Messages');
        });
    }
};
//# sourceMappingURL=20230515171659-create-message.js.map