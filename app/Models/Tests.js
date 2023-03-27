'use strict';

const { Model } = require('sequelize');
const { Questions } = model("");
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Tests extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.myAssociation = models.Tests.hasMany(models.Questions, {
                foreignKey: "test_id",
                as: 'Questions'
            });

            this.myAssociation = models.Tests.hasMany(models.Marks, {
                foreignKey: "test_id",
                as: 'Student Marks'
            });


            // Define the association between Tests and Users through Marks
            this.myAssociation = models.Tests.belongsToMany(models.Users, {
                through: models.Marks,
                foreignKey: 'test_id',
                otherKey: 'student_id',
                as: 'Students'
            });

        }
    };
    Tests.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        lesson_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'Tests',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });

    return Tests;

};