'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Achievements', {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Achievements');
  }
};