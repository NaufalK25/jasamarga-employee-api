const express = require('express');
const { body, param } = require('express-validator');
const { EmployeeFamily } = require('../../database/models');
const { methodNotAllowed } = require('../../controllers/errors');
const { create, destroy, findAll, findOne, update } = require('../../controllers/employeeFamily');

const router = express.Router();

router.route('/employee/family')
    .get(findAll)
    .post([
        body('employee_id')
            .trim()
            .notEmpty().withMessage('Employee Id is required')
            .isInt().withMessage(' must be an integer'),
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('identifier')
            .trim()
            .notEmpty().withMessage('Identifier is required')
            .isString().withMessage('Identifier must be a string')
            .custom(async value => {
                const employeeFamily = await EmployeeFamily.findOne({ where: { identifier: value } });
                if (employeeFamily) {
                    throw new Error('Identifier already exists');
                }
            }),
        body('job')
            .trim()
            .notEmpty().withMessage('Job is required')
            .isString().withMessage('Job must be a string'),
        body('place_of_birth')
            .trim()
            .notEmpty().withMessage('Place Of Birth is required')
            .isString().withMessage('Place Of Birth must be a string'),
        body('date_of_birth')
            .notEmpty().withMessage('Date of Birth is required')
            .isDate().withMessage('Date of Birth must be a date'),
        body('religion')
            .notEmpty().withMessage('Religion is required')
            .isIn(['Islam', 'Katolik', 'Buddha', 'Protestan', 'Konghucu']).withMessage('Religion must be one of: Islam, Katolik, Buddha, Protestan, or Konghucu'),
        body('is_life')
            .optional()
            .isBoolean().withMessage('Is Life must be boolean'),
        body('is_divorced')
            .optional()
            .isBoolean().withMessage('Is Divorced must be boolean'),
        body('relation_status')
            .notEmpty().withMessage('Relation Status is required')
            .isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']).withMessage('Relation Status must be one of: Suami, Istri, Anak, or Anak Sambung'),
        body('created_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('updated_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
    ], create)
    .all(methodNotAllowed);

router.route('/employee/family/:id')
    .get([
        param('id').isInt().withMessage('Id must be an integer'),
    ], findOne)
    .patch([
        param('id').isInt().withMessage('Id must be an integer'),
        body('employee_id')
            .trim()
            .optional()
            .isInt().withMessage(' must be an integer'),
        body('name')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('identifier')
            .trim()
            .optional()
            .isString().withMessage('Identifier must be a string')
            .custom(async value => {
                const employeeFamily = await EmployeeFamily.findOne({ where: { identifier: value } });
                if (employeeFamily) {
                    throw new Error('Identifier already exists');
                }
            }),
        body('job')
            .trim()
            .optional()
            .isString().withMessage('Job must be a string'),
        body('place_of_birth')
            .trim()
            .optional()
            .isString().withMessage('Place Of Birth must be a string'),
        body('date_of_birth')
            .optional()
            .isDate().withMessage('Date of Birth must be a date'),
        body('religion')
            .optional()
            .isIn(['Islam', 'Katolik', 'Buddha', 'Protestan', 'Konghucu']).withMessage('Religion must be one of: Islam, Katolik, Buddha, Protestan, or Konghucu'),
        body('is_life')
            .optional()
            .isBoolean().withMessage('Is Life must be boolean'),
        body('is_divorced')
            .optional()
            .isBoolean().withMessage('Is Divorced must be boolean'),
        body('relation_status')
            .optional()
            .isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']).withMessage('Relation Status must be one of: Suami, Istri, Anak, or Anak Sambung'),
        body('created_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
        body('updated_by')
            .trim()
            .optional()
            .isString().withMessage('Name must be a string'),
    ], update)
    .delete([
        param('id').isInt().withMessage('Id must be an integer'),
    ], destroy)
    .all(methodNotAllowed);

module.exports = router;