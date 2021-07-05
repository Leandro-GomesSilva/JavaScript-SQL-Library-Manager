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
      allowNull: true,
      // Adding a custom validation for the 'year' attribute to match integers and integers in the fornmat YYYY
      validate: {
        customValidation (value) {
          if ( this.year && isNaN(value) ) {    // If 'year' is empty i.e. 'falsy', this block will be skipped
            throw new Error('The field "Year" must be an integer.');
          } else if ( this.year && /^\d{4}$/.test(value) == false ) {   // If 'year' is empty i.e. 'falsy', this block will be skipped
            throw new Error('The field "Year" must be in the format YYYY.');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};