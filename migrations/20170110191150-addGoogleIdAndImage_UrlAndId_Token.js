'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        // add facebookId and facebookToken as columns
        return queryInterface.addColumn('users', 'GoogleId', Sequelize.STRING).then(function() {
            return queryInterface.addColumn('users', 'GoogleImage_Url', Sequelize.STRING).then(function() {
                return queryInterface.addColumn('users', 'GoogleId_Token', Sequelize.STRING);
            });
        });
    },

    down: function(queryInterface, Sequelize) {
        // remove facebookToken and facebookId as columns
        return queryInterface.removeColumn('users', 'GoogleId').then(function() {
            return queryInterface.removeColumn('users', 'GoogleImage_Url').then(function() {
                return queryInterface.removeColumn('users', 'GoogleId_Token');
            });
        });
    }
};
