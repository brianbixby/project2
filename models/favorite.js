'use strict';
module.exports = function(sequelize, DataTypes) {
    var favorite = sequelize.define('favorite', {
        indicatorcode: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.favorite.belongsToMany(models.user, {
                    through: "usersFavorites"
                });
            }
        }
    });
    return favorite;
};
