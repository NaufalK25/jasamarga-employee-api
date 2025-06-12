'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.EmployeeProfile, { foreignKey: 'employee_id' });
      this.hasMany(models.EmployeeFamily, { foreignKey: 'employee_id' });
      this.hasMany(models.Education, { foreignKey: 'employee_id' });
    }
  }
  Employee.init({
    nik: DataTypes.STRING,
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employee',
    underscored: true,
  });
  return Employee;
};