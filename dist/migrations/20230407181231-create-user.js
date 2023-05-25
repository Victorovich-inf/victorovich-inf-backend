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
            yield queryInterface.createTable('Users', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    unique: true
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                firstName: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                lastName: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                role: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                banned: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                confirmationCode: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                vkId: {
                    allowNull: true,
                    type: Sequelize.STRING
                }
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Users');
        });
    }
};
//# sourceMappingURL=20230407181231-create-user.js.map