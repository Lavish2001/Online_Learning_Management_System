'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Enrollments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.myAssociation = models.Enrollments.belongsTo(models.Courses, {
                foreignKey: "course_id",
                as: 'Course'
            });

            this.myAssociation = models.Enrollments.belongsTo(models.Grades, {
                foreignKey: "course_id",
                as: 'Grade'
            });
        }
    };
    Enrollments.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        course_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        student_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        enrolled_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        completed_at: {
            type: DataTypes.DATE
        }

    }, {
        sequelize,
        tableName: 'Enrollments',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });

    // Define the hook to prevent records with same student id and course id from being saved

    Enrollments.beforeCreate(async (enroll, options) => {
        const existingEnrollment = await Enrollments.findOne({
            where: {
                student_id: enroll.student_id,
                course_id: enroll.course_id
            }
        });

        if (existingEnrollment) {
            throw new Error('An enrollment with the same student id and course id already exists.');
        }
    });

    return Enrollments;

};