'use strict';
module.exports = function(sequelize, DataTypes) {
    var post = sequelize.define('post', {
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        userId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.post.belongsTo(models.user);
                models.post.hasMany(models.comment);
                models.post.belongsToMany(models.tag, {
                    through: "post_tag"
                });
            }
        }
    });
    return post;
};
