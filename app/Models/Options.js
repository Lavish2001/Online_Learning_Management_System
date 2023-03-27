'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Options extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Options.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        question_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        option: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'Options',
        timestamps: true,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        underscored: true
    });


    // Define the hook to prevent records with same order id and course id from being saved

    Options.beforeCreate(async (option, options) => {
        const existingOptions = await Options.findAll({
            where: {
                question_id: option.question_id
            }
        });

        if (existingOptions.length >= 4) {
            throw new Error('Maximum Four Options are allowed for one question.');
        }
    });

    return Options;

};