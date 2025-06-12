const express = require('express');
const multer = require('multer');
const { body, param } = require('express-validator');
const { EmployeeProfile } = require('../../database/models');
const { methodNotAllowed } = require('../../controllers/errors');
const { create, destroy, findAll, findOne, update } = require('../../controllers/employeeProfile');
const { profileStorage } = require('../../middlewares/file');

const router = express.Router();

router.route('/employee/profile')
    .get(findAll)
    .post(multer({ storage: profileStorage }).single('prof_pict'), [
        body('employee_id')
            .trim()
            .notEmpty().withMessage('Employee Id is required')
            .isInt().withMessage(' must be an integer')
            .custom(async value => {
                const employeeProfile = await EmployeeProfile.findOne({ where: { employee_id: value } });
                if (employeeProfile) {
                    throw new Error('NIK already exists');
                }
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

router.route('/employee/profile/:id')
    .get([
        param('id').isInt().withMessage('Id must be an integer'),
    ], findOne)
    .patch(multer({ storage: profileStorage }).single('prof_pict'), [
        param('id').isInt().withMessage('Id must be an integer'),
        body('employee_id')
            .trim()
            .optional()
            .isInt().withMessage(' must be an integer')
            .custom(async value => {
                const employeeProfile = await EmployeeProfile.findOne({ where: { employee_id: value } });
                if (employeeProfile) {
                    throw new Error('NIK already exists');
                }
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