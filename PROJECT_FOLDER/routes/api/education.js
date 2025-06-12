const express = require('express');
const { body, param } = require('express-validator');
const { Education } = require('../../database/models');
const { methodNotAllowed } = require('../../controllers/errors');
const { create, destroy, findAll, findOne, update } = require('../../controllers/education');

const router = express.Router();

router.route('/employee/education')
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
        body('level')
            .notEmpty().withMessage('Level is required')
            .isIn(['Tk', 'Sd', 'Smp', 'Sma', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']).withMessage('Level must be one of: Tk, Sd, Smp, Sma, Strata 1, Strata 2, Doktor, or Profesor'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required')
            .isString().withMessage('Description must be a string'),
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

router.route('/employee/education/:id')
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
        body('level')
            .optional()
            .isIn(['Tk', 'Sd', 'Smp', 'Sma', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']).withMessage('Level must be one of: Tk, Sd, Smp, Sma, Strata 1, Strata 2, Doktor, or Profesor'),
        body('description')
            .trim()
            .optional()
            .isString().withMessage('Description must be a string'),
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