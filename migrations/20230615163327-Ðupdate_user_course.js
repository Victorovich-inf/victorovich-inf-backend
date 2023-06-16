'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'CourseUsers',
                'end',
                {
                    type: Sequelize.DATE,
                }
            ),
            queryInterface.addColumn(
                'CourseUsers',
                'completed',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                'CourseUsers',
                'admin',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            )
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    }
};
