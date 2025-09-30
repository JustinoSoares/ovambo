'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
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
      type: DataTypes.STRING, // Alterado para STRING para suportar números internacionais
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Garante que o valor seja um email válido
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM("admin"),
      defaultValue: "admin",
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
  });

  // Isso vai sincronizar TODOS os models com o banco
  /*sequelize.sync({ alter: true })
    .then(() => {
      console.log("✅ Todas as tabelas foram atualizadas com sucesso!");
    })
    .catch((error) => {
      console.error("❌ Erro ao sincronizar tabelas:", error);
    });*/
  return Users;
};


