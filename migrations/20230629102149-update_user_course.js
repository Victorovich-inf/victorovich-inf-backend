'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'ProgressCourseUsers',
          'userId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Users',
              key: 'id',
              as: 'userId',
            }
          }
      ),
      queryInterface.addColumn(
          'ProgressCourseUsers',
          'courseId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Courses',
              key: 'id',
              as: 'courseId',
            }
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
