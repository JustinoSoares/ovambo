'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Enrollments extends Model {
    static associate(models) {
      // Inscrição pertence a um curso
      Enrollments.belongsTo(models.Courses, {
        foreignKey: "course_id",
        as: "course"
      });
    }
  }
  Enrollments.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Enrollments',
    tableName: 'Enrollments',
  });
  return Enrollments;
};
