'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Courses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.myAssociation = models.Courses.hasMany(models.Lessons, {
                foreignKey: "course_id",
                as: 'Lessons'
            });

            this.myAssociation = models.Courses.belongsTo(models.Users, {
                foreignKey: "teacher_id",
                as: 'Created_By'
            });

            this.myAssociation = models.Courses.hasMany(models.Grades, {
                foreignKey: "course_id",
                as: 'Grade'
            });

            this.myAssociation = models.Courses.hasMany(models.Enrollments, {
                foreignKey: "course_id",
                as: 'Course'
            });

            // Define the association between Courses and Users through Grades
            this.myAssociation = models.Courses.belongsToMany(models.Users, {
                through: models.Grades,
                foreignKey: 'course_id',
                otherKey: 'student_id',
                as: 'Students'
            });

            this.myAssociation = models.Courses.belongsToMany(models.Users, {
                through: models.Enrollments,
                foreignKey: 'course_id',
                otherKey: 'student_id',
                as: 'EnrolledStudents'
            });
        }
    };
    Courses.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        course_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        course_price: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        teacher_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'Courses',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });

    return Courses;

};