'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'Lessons',
          'views',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
      ),
      queryInterface.addColumn(
          'Lessons',
          'start',
          {
            type: Sequelize.DATE
          }
      )
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
