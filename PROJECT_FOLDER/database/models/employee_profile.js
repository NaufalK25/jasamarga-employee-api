'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    }
  }
  EmployeeProfile.init({
    place_of_birth: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.ENUM('Laki-Laki', 'Perempuan'),
    is_married: DataTypes.BOOLEAN,
    prof_pict: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EmployeeProfile',
    tableName: 'employee_profile',
    underscored: true,
  });
  return EmployeeProfile;
};