'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    static associate(models) {
      // Uma categoria pode ter vários cursos
      Categories.hasMany(models.Courses, {
        foreignKey: "category_id",
        as: "courses"
      });
    }
  }

  Categories.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // evitar categorias duplicadas
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Categories',
    tableName: 'Categories',
  });

  return Categories;
};
