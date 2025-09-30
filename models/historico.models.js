"use strict";
const { Model, DataTypes } = require("sequelize");
const Vigilante = require("./vigilante.models");
const Users = require("../models/users.models");
const Aluno = require("./aluno.models");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Historico extends Model {}

  Historico.init(
    {

      id : {
        type : DataTypes.UUID,
        defaultValue : uuidv4,
        primaryKey : true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Permitido", "Negado", "Pendente"),
        defaultValue: "Pendente",
        allowNull: false,
      },
      motivo_negacao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
      },
      alunoId: {
        type: DataTypes.INTEGER,
        references: {
          model: Aluno,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Historico",
      tableName: "Historico",
    }
  );

  return Historico;
};
