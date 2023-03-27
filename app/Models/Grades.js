'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Grades extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.myAssociation = models.Grades.belongsTo(models.Courses, {
                foreignKey: "course_id",
                as: 'Courses'
            });


        }
    };
    Grades.init({

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
        grade: {
            type: DataTypes.ENUM('A', 'B', 'C', 'D')
        }

    }, {
        sequelize,
        tableName: 'Grades',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });


    return Grades;

};