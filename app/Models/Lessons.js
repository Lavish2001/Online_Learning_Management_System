'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Lessons extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.myAssociation = models.Lessons.hasMany(models.Tests, {
                foreignKey: "lesson_id",
                as: 'Tests'
            });
        }
    };
    Lessons.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        course_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        video: {
            type: DataTypes.STRING,
            allowNull: false
        },

        documentation: {
            type: DataTypes.STRING,
            allowNull: false
        },

        order: {
            type: DataTypes.BIGINT,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'Lessons',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });

    // Define the hook to prevent records with same order id and course id from being saved

    Lessons.beforeCreate(async (lesson, options) => {
        const existingLesson = await Lessons.findOne({
            where: {
                order: lesson.order,
                course_id: lesson.course_id
            }
        });

        if (existingLesson) {
            throw new Error('A lesson with the same order id and course id already exists.');
        }
    });

    return Lessons;

};