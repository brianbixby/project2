'use strict';
module.exports = function(sequelize, DataTypes) {
    var comment = sequelize.define('comment', {
        content: DataTypes.TEXT,
        postId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.comment.belongsTo(models.user);
                models.comment.belongsTo(models.post);
            }
        }
    });
    return comment;
};
