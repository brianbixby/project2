'use strict';
module.exports = function(sequelize, DataTypes) {
  var project_two = sequelize.define('project_two', {
    name: DataTypes.STRING,
    category: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return project_two;
};