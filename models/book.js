'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    // Definition of the data type of each property
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The field "Title" cannot be empty. Please provide a value.'
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The field "Author" cannot be empty. Please provide a value.'
        },
      },
    },
    genre: DataTypes.STRING,
    year: {
      type: DataTypes.INTEGER,
      // Adding a validation for the 'year' attribute
      validate: {
        isInt: {
          args: true,
          msg: 'The field "Year" must be an integer.',
        },
        len: {
          args: [4,4],
          msg: 'The field "Year" must be in the format YYYY.',
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};