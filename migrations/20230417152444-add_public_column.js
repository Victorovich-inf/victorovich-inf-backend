'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn( 'Lessons', 'public', Sequelize.BOOLEAN );
    await queryInterface.addColumn( 'Tasks', 'public', Sequelize.BOOLEAN );
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
