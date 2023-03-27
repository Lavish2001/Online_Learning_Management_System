'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Marks extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Marks.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        test_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        student_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        student_marks: {
            type: DataTypes.BIGINT
        },
        total_marks: {
            type: DataTypes.BIGINT
        }

    }, {
        sequelize,
        tableName: 'Marks',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });



    // Define the hook to student cant give same test twice

    Marks.beforeCreate(async (marks, options) => {
        const existingMarks = await Marks.findOne({
            where: {
                student_id: marks.student_id,
                test_id: marks.test_id
            }
        });

        if (existingMarks) {
            throw new Error('You cannot give this test twice.');
        }
    });

    return Marks;

};