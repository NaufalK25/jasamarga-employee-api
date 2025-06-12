const express = require('express');
const employee = require('./employee');
const employeeProfile = require('./employeeProfile');
const employeeFamily = require('./employeeFamily');
const education = require('./education');

const router = express.Router();

router.use(employeeFamily);
router.use(education);
router.use(employeeProfile);
router.use(employee);

module.exports = router;