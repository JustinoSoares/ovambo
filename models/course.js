'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
    class Courses extends Model {
        static associate(models) {
            // Curso tem várias inscrições
            Courses.hasMany(models.Enrollments, {
                foreignKey: "course_id",
                as: "enrollments"
            });
            Courses.belongsTo(models.Categories, {
                foreignKey: "category_id",
                as: "category"
            })
        }
    }
    Courses.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.00,
        },
        limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        workload: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        modality: {
            type: DataTypes.ENUM('online', 'inperson'),
            allowNull: false,
            defaultValue: 'inperson',
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Courses',
        tableName: 'Courses',
    });
    return Courses;
};
