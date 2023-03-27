'use strict';

const { Model } = require('sequelize');
const { Options } = model("");
module.exports = (sequelize, DataTypes) => {

    class Questions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            this.myAssociation = models.Questions.hasMany(models.Options, {
                foreignKey: "question_id",
                as: 'Options'
            });
        }
    };
    Questions.init({

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
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        correct_answer: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }

    }, {
        sequelize,
        tableName: 'Questions',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });

    return Questions;

};