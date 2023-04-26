'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};
