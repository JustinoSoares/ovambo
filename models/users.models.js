'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Exemplo de associação:
      // Users.hasMany(models.Courses, { foreignKey: "created_by", as: "courses" });
    }
  }

  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
      },
      nome_completo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM("admin"),
        allowNull: false,
        defaultValue: "admin",
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "Users",
    }
  );

  return Users;
};
