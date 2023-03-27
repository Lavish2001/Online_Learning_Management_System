'use strict';
//   where: Sequelize.literal('`Courses`.`id` != `Grades`.`course_id`')
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.myAssociation = models.Users.hasMany(models.Grades, {
        foreignKey: "student_id",
        as: 'Grades'
      });
    }
  };
  Users.init({

    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM('Teacher', 'Student'),
      allowNull: false
    }

  }, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscored: true
  });

  return Users;

};