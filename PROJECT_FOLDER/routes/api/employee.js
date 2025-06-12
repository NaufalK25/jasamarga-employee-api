const express = require('express');
const multer = require('multer');
const { body, param } = require('express-validator');
const { Employee, EmployeeFamily } = require('../../database/models');
const { methodNotAllowed } = require('../../controllers/errors');
const { create, destroy, findAll, findOne, report, update } = require('../../controllers/employee');
const { profileStorage } = require('../../middlewares/file');

const router = express.Router();

router.route('/employee/report')
    .get(report)
    .all(methodNotAllowed);

router.route('/employee')
    .get(findAll)
    .post(multer({ storage: profileStorage }).single('prof_pict'), [
        body('nik')
            .trim()
            .notEmpty().withMessage('NIK is required')
            .isString().withMessage('NIK must be a string')
            .custom(async value => {
                const employee = await Employee.findOne({ where: { nik: value } });
                if (employee) {
                    throw new Error('NIK already exists');
                }
            }),
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('is_active')
            .optional()
            .isBoolean().withMessage('Is Active must be boolean'),
        body('start_date')
            .notEmpty().withMessage('Start Date is required')
            .isDate().withMessage('Start Date must be a date'),
        body('end_date')
            .notEmpty().withMessage('End Date is required')
            .isDate().withMessage('End Date must be a date')
            .custom((value, { req }) => {
                const startDate = new Date(req.body.start_date);
                const endDate = new Date(value);
                if (endDate <= startDate) {
                    throw new Error('End Date must be after Start Date');
                }
                return true;
            }),
        body('place_of_birth')
            .trim()
            .notEmpty().withMessage('Place of Birth is required')
            .isString().withMessage('Place of Birth must be a string'),
        body('date_of_birth')
            .notEmpty().withMessage('Date of Birth is required')
            .isDate().withMessage('Date of Birth must be a date'),
        body('gender')
            .notEmpty().withMessage('Gender is required')
            .isIn(['Laki-Laki', 'Perempuan']).withMessage('Gender must be one of: Laki-Laki or Perempuan'),
        body('is_married')
            .notEmpty().withMessage('Is Married is required')
            .isBoolean().withMessage('Is Married must be boolean'),
        body('educations').optional().isArray().withMessage('Educations must be an array'),
        body('educations.*.name')
            .if(body('educations').exists())
            .trim()
            .notEmpty().withMessage('Education Name is required')
            .isString().withMessage('Education Name must be a string'),
        body('educations.*.level')
            .if(body('educations').exists())
            .notEmpty().withMessage('Education Level is required')
            .isIn(['Tk', 'Sd', 'Smp', 'Sma', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']).withMessage('Education Level must be one of: Tk, Sd, Smp, Sma, Strata 1, Strata 2, Doktor, or Profesor'),
        body('educations.*.description')
            .if(body('educations').exists())
            .trim()
            .notEmpty().withMessage('Education Description is required')
            .isString().withMessage('Education Description must be a string'),
        body('employeeFamilies').optional().isArray().withMessage('EmployeeFamilies must be an array'),
        body('employeeFamilies.*.name')
            .if(body('employeeFamilies').exists())
            .trim()
            .notEmpty().withMessage('Employee Family Name is required')
            .isString().withMessage('Employee Family Name must be a string'),
        body('employeeFamilies.*.identifier')
            .if(body('employeeFamilies').exists())
            .trim()
            .notEmpty().withMessage('Employee Family Identifier is required')
            .isString().withMessage('Employee Family Identifier must be a string')
            .custom(async value => {
                const employeeFamily = await EmployeeFamily.findOne({ where: { identifier: value } });
                if (employeeFamily) {
                    throw new Error('Identifier already exists');
                }
            }),
        body('employeeFamilies.*.job')
            .if(body('employeeFamilies').exists())
            .trim()
            .notEmpty().withMessage('Employee Family Job is required')
            .isString().withMessage('Employee Family Job must be a string'),
        body('employeeFamilies.*.place_of_birth')
            .if(body('employeeFamilies').exists())
            .trim()
            .notEmpty().withMessage('Employee Family Place Of Birth is required')
            .isString().withMessage('Employee Family Place Of Birth must be a string'),
        body('employeeFamilies.*.date_of_birth')
            .if(body('employeeFamilies').exists())
            .notEmpty().withMessage('Employee Family Date of Birth is required')
            .isDate().withMessage('Employee Family Date of Birth must be a date'),
        body('employeeFamilies.*.religion')
            .if(body('employeeFamilies').exists())
            .notEmpty().withMessage('Employee Family Religion is required')
            .isIn(['Islam', 'Katolik', 'Buddha', 'Protestan', 'Konghucu']).withMessage('Employee Family Religion must be one of: Islam, Katolik, Buddha, Protestan, or Konghucu'),
        body('employeeFamilies.*.is_life')
            .if(body('employeeFamilies').exists())
            .optional()
            .isBoolean().withMessage('Is Life must be boolean'),
        body('employeeFamilies.*.is_divorced')
            .if(body('employeeFamilies').exists())
            .optional()
            .isBoolean().withMessage('Is Divorced must be boolean'),
        body('employeeFamilies.*.relation_status')
            .if(body('employeeFamilies').exists())
            .notEmpty().withMessage('Employee Family Relation Status is required')
            .isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']).withMessage('Employee Family Relation Status must be one of: Suami, Istri, Anak, or Anak Sambung'),
        body('created_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('updated_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
    ], (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({
                errors: [{
                    "type": "field",
                    "msg": "Prof Pict is required",
                    "path": "prof_pict",
                    "location": "file"
                }]
            });
        }
        next();
    }, create)
    .all(methodNotAllowed);

router.route('/employee/:id')
    .get([
        param('id').isInt().withMessage('Id must be an integer'),
    ], findOne)
    .patch(multer({ storage: profileStorage }).single('prof_pict'), [
        param('id').isInt().withMessage('Id must be an integer'),
        body('nik')
            .trim()
            .optional()
            .isString().withMessage('NIK must be a string')
            .custom(async value => {
                const employee = await Employee.findOne({ where: { nik: value } });
                if (employee) {
                    throw new Error('NIK already exists');
                }
            }),
        body('name')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('is_active')
            .optional()
            .isBoolean().withMessage('Is Active must be boolean'),
        body('start_date')
            .optional()
            .isDate().withMessage('Start Date must be a date'),
        body('end_date')
            .optional()
            .isDate().withMessage('End Date must be a date')
            .custom((value, { req }) => {
                if (req.body.start_date) {
                    const startDate = new Date(req.body.start_date);
                    const endDate = new Date(value);
                    if (endDate <= startDate) {
                        throw new Error('End Date must be after Start Date');
                    }
                    return true;
                }
                return false;
            }),
        body('place_of_birth')
            .trim()
            .optional()
            .isString().withMessage('Place of Birth must be a string'),
        body('date_of_birth')
            .optional()
            .isDate().withMessage('Date of Birth must be a date'),
        body('gender')
            .optional()
            .isIn(['Laki-Laki', 'Perempuan']).withMessage('Gender must be one of: Laki-Laki or Perempuan'),
        body('is_married')
            .optional()
            .isBoolean().withMessage('Is Married must be boolean'),
        body('educations').optional().isArray().withMessage('Educations must be an array'),
        body('educations.*.id')
            .if(body('educations').exists())
            .trim()
            .notEmpty().withMessage('Education Id is required')
            .isInt().withMessage('Education Id must be an integer'),
        body('educations.*.name')
            .if(body('educations').exists())
            .if(body('educations.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Education Name must be a string'),
        body('educations.*.level')
            .if(body('educations').exists())
            .if(body('educations.*.id').exists())
            .optional()
            .isIn(['Tk', 'Sd', 'Smp', 'Sma', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']).withMessage('Education Level must be one of: Tk, Sd, Smp, Sma, Strata 1, Strata 2, Doktor, or Profesor'),
        body('educations.*.description')
            .if(body('educations').exists())
            .if(body('educations.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Education Description must be a string'),
        body('employeeFamilies').optional().isArray().withMessage('EmployeeFamilies must be an array'),
        body('employeeFamilies.*.id')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .trim()
            .notEmpty().withMessage('Employee Family Id is required')
            .isInt().withMessage('Employee Family Id must be an integer'),
        body('employeeFamilies.*.name')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Employee Family Name must be a string'),
        body('employeeFamilies.*.identifier')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Employee Family Identifier must be a string')
            .custom(async value => {
                const employeeFamily = await EmployeeFamily.findOne({ where: { identifier: value } });
                if (employeeFamily) {
                    throw new Error('Identifier already exists');
                }
            }),
        body('employeeFamilies.*.job')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Employee Family Job must be a string'),
        body('employeeFamilies.*.place_of_birth')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .trim()
            .optional()
            .isString().withMessage('Employee Family Place Of Birth must be a string'),
        body('employeeFamilies.*.date_of_birth')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .optional()
            .isDate().withMessage('Employee Family Date of Birth must be a date'),
        body('employeeFamilies.*.religion')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .optional()
            .isIn(['Islam', 'Katolik', 'Buddha', 'Protestan', 'Konghucu']).withMessage('Employee Family Religion must be one of: Islam, Katolik, Buddha, Protestan, or Konghucu'),
        body('employeeFamilies.*.is_life')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .optional()
            .isBoolean().withMessage('Is Life must be boolean'),
        body('employeeFamilies.*.is_divorced')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .optional()
            .isBoolean().withMessage('Is Divorced must be boolean'),
        body('employeeFamilies.*.relation_status')
            .if(body('employeeFamilies').exists())
            .if(body('employeeFamilies.*.id').exists())
            .optional()
            .isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']).withMessage('Employee Family Relation Status must be one of: Suami, Istri, Anak, or Anak Sambung'),
        body('created_by')
            .trim()
            .optional()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('updated_by')
            .trim()
            .optional()
            .optional()
            .isString().withMessage('Name must be a string'),
    ], update)
    .delete([
        param('id').isInt().withMessage('Id must be an integer'),
    ], destroy)
    .all(methodNotAllowed);

module.exports = router;