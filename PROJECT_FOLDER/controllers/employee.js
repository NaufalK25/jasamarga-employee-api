const fs = require('fs');
const { validationResult } = require('express-validator');
const { badRequest, internalServerError, notFoundData } = require('./errors');
const { sequelize, Education, Employee, EmployeeFamily, EmployeeProfile } = require('../database/models');
const { calculateAge } = require('../helper');

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
const unlinkProfilePicturePath = `${__dirname}/../uploads/profiles/`;
const jsonProfilePicturePath = `${baseUrl}/uploads/profiles/`;

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                transaction.rollback();
                return badRequest(errors.array(), req, res);
            }

            const employee = await Employee.create({
                nik: req.body.nik,
                name: req.body.name,
                is_active: req.body.is_active ?? true,
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                created_by: req.body.created_by ?? 'Admin',
                updated_by: req.body.updated_by ?? 'Admin'
            }, { transaction });

            const profilePicture = req.file ? req.file.filename : 'default_profile.png'

            await EmployeeProfile.create({
                employee_id: employee.id,
                place_of_birth: req.body.place_of_birth,
                date_of_birth: req.body.date_of_birth,
                gender: req.body.gender,
                is_married: req.body.is_married,
                prof_pict: profilePicture,
                created_by: req.body.created_by ?? 'Admin',
                updated_by: req.body.updated_by ?? 'Admin'
            }, { transaction });

            const educations = req.body.educations;
            if (educations && educations.length > 0) {
                for (const education of educations) {
                    const data = {
                        ...education,
                        employee_id: employee.id,
                        created_by: req.body.created_by ?? 'Admin',
                        updated_by: req.body.updated_by ?? 'Admin'
                    };

                    await Education.create(data, { transaction });
                }
            }

            const employeeFamilies = req.body.employeeFamilies;
            if (employeeFamilies && employeeFamilies.length > 0) {
                for (const employeeFamily of employeeFamilies) {
                    const data = {
                        ...employeeFamily,
                        employee_id: employee.id,
                        is_life: employeeFamily.is_life ?? true,
                        is_divorced: employeeFamily.is_divorced ?? false,
                        created_by: req.body.created_by ?? 'Admin',
                        updated_by: req.body.updated_by ?? 'Admin'
                    };

                    await EmployeeFamily.create(data, { transaction });
                }
            }

            transaction.commit();

            const newEmployee = await Employee.findByPk(employee.id, {
                include: [
                    { model: EmployeeProfile },
                    { model: Education },
                    { model: EmployeeFamily },
                ]
            });

            res.status(201).json({
                statusCode: 201,
                message: 'Employee created successfully',
                data: newEmployee
            });
        } catch (err) {
            transaction.rollback();
            return internalServerError(err, req, res);
        }
    },
    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                transaction.rollback();
                return badRequest(errors.array(), req, res);
            }

            const employeeId = req.params.id;
            const employee = await Employee.findByPk(employeeId);

            if (!employee) {
                transaction.rollback();
                return notFoundData(req, res);
            }

            const employeeProfile = await EmployeeProfile.findOne({ where: { employee_id: employee.id } });

            if (!employeeProfile) {
                transaction.rollback();
                return notFoundData(req, res);
            }

            const oldEmployeeData = { ...employee.dataValues };
            const employeeFields = Object.keys(Employee.rawAttributes);

            const profilePicture = req.file ? req.file.filename : undefined;

            const requestBody = { ...req.body };

            if (profilePicture) requestBody.prof_pict = profilePicture;

            const oldEmployeeProfileData = { ...employeeProfile.dataValues };
            const employeeProfileFields = Object.keys(EmployeeProfile.rawAttributes);

            const before = {
                educations: [],
                employeeFamilies: [],
            }, after = {
                educations: [],
                employeeFamilies: [],
            };

            if (requestBody) {
                let fieldChanged = Object.keys(requestBody).filter(field => employeeFields.includes(field));

                for (const field of fieldChanged) {
                    before[field] = oldEmployeeData[field];
                    after[field] = requestBody[field];
                }

                await Employee.update(after, { where: { id: employeeId }, transaction });

                let employeeProfileFieldChange = Object.keys(requestBody).filter(field => employeeProfileFields.includes(field));

                for (const field of employeeProfileFieldChange) {
                    before[field] = oldEmployeeProfileData[field];
                    after[field] = requestBody[field];
                }

                if (req.file && oldEmployeeProfileData.profilePicture !== 'default_profile.png') {
                    fs.unlink(`${unlinkProfilePicturePath}${oldEmployeeProfileData.prof_pict}`, err => {
                        if (err) return internalServerError(err, req, res);
                    });
                }

                await EmployeeProfile.update(after, { where: { id: employeeProfile.id }, transaction });

                if (before.profilePicture && after.profilePicture) {
                    before.profilePicture = `${jsonProfilePicturePath}${before.profilePicture}`;
                    after.profilePicture = `${jsonProfilePicturePath}${after.profilePicture}`;
                }

                const educations = requestBody?.educations ?? [];
                for (const education of educations) {
                    if (!education.id) continue;

                    const existingEducation = await Education.findByPk(education.id);
                    if (!existingEducation) continue;

                    const oldEducationData = { ...existingEducation.dataValues };
                    const educationChanges = {};
                    const beforeEd = {}, afterEd = {};

                    Object.keys(education).forEach(field => {
                        if (oldEducationData[field] !== education[field]) {
                            beforeEd[field] = oldEducationData[field];
                            afterEd[field] = education[field];
                            educationChanges[field] = education[field];
                        }
                    });

                    if (Object.keys(educationChanges).length > 0) {
                        await Education.update(educationChanges, { where: { id: education.id }, transaction });
                        before.educations.push({ id: education.id, ...beforeEd });
                        after.educations.push({ id: education.id, ...afterEd });
                    }
                }

                const employeeFamilies = requestBody?.employeeFamilies ?? [];
                for (const employeeFamily of employeeFamilies) {
                    if (!employeeFamily.id) continue;

                    const existingEmployeeFamily = await EmployeeFamily.findByPk(employeeFamily.id);
                    if (!existingEmployeeFamily) continue;

                    const oldEmployeeFamilyData = { ...existingEmployeeFamily.dataValues };
                    const employeeFamilyChanges = {};
                    const beforeFam = {}, afterFam = {};

                    Object.keys(employeeFamily).forEach(field => {
                        if (oldEmployeeFamilyData[field] !== employeeFamily[field]) {
                            beforeFam[field] = oldEmployeeFamilyData[field];
                            afterFam[field] = employeeFamily[field];
                            employeeFamilyChanges[field] = employeeFamily[field];
                        }
                    });

                    if (Object.keys(employeeFamilyChanges).length > 0) {
                        await EmployeeFamily.update(employeeFamilyChanges, { where: { id: employeeFamily.id }, transaction });
                        before.employeeFamilies.push({ id: employeeFamily.id, ...beforeFam });
                        after.employeeFamilies.push({ id: employeeFamily.id, ...afterFam });
                    }
                }
            }

            transaction.commit();

            res.status(200).json({
                statusCode: 200,
                message: 'Employee updated successfully',
                data: { before, after }
            });
        } catch (err) {
            transaction.rollback();
            return internalServerError(err, req, res);
        }
    },
    destroy: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeId = req.params.id;
            const employee = await Employee.findByPk(employeeId, {
                include: [
                    { model: EmployeeProfile },
                    { model: Education },
                    { model: EmployeeFamily },
                ]
            });

            if (!employee) return notFoundData(req, res);

            const employeeProfile = await EmployeeProfile.findOne({ where: { employee_id: employeeId } });
            const educations = await Education.findAll({ where: { employee_id: employeeId } });
            const employeeFamilies = await EmployeeFamily.findAll({ where: { employee_id: employeeId } });

            if (employeeProfile) {
                const profilePicture = employeeProfile.prof_pict;

                if (profilePicture !== 'default_profile.png') {
                    fs.unlink(`${unlinkProfilePicturePath}${profilePicture}`, err => {
                        if (err) return internalServerError(err, req, res);
                    });
                }

                await EmployeeProfile.destroy({ where: { employee_id: employeeId } });
            }

            educations.forEach(async education => {
                if (education) {
                    await Education.destroy({
                        where: {
                            id: education.id,
                            employee_id: employeeId
                        }
                    });
                }
            });

            employeeFamilies.forEach(async employeeFamily => {
                if (employeeFamily) {
                    await EmployeeFamily.destroy({
                        where: {
                            id: employeeFamily.id,
                            employee_id: employeeId
                        }
                    });
                }
            });

            await Employee.destroy({ where: { id: employeeId } });

            res.status(200).json({
                statusCode: 200,
                message: 'Employee deleted successfully',
                data: employee
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findOne: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employee = await Employee.findByPk(req.params.id, {
                include: [
                    { model: EmployeeProfile },
                    { model: Education },
                    { model: EmployeeFamily },
                ]
            });

            if (!employee) return notFoundData(req, res);

            if (employee.EmployeeProfile) {
                const profilePicture = employee.EmployeeProfile.prof_pict;
                employee.EmployeeProfile.prof_pict = `${jsonProfilePicturePath}${profilePicture}`;
            }

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employee
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findAll: async (req, res) => {
        try {
            const employees = await Employee.findAll({
                include: [
                    { model: EmployeeProfile },
                    { model: Education },
                    { model: EmployeeFamily },
                ]
            });

            employees.forEach(employee => {
                if (employee.EmployeeProfile) {
                    const profilePicture = employee.EmployeeProfile.prof_pict;
                    employee.EmployeeProfile.prof_pict = `${jsonProfilePicturePath}${profilePicture}`;
                }
            });

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employees
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    report: async (req, res) => {
        try {
            const employees = await Employee.findAll({
                attributes: ['id', 'nik', 'name', 'is_active'],
                include: [
                    {
                        model: EmployeeProfile,
                        attributes: ['gender', 'date_of_birth']
                    },
                    {
                        model: Education,
                        attributes: ['name', 'level'],
                    },
                    {
                        model: EmployeeFamily,
                        attributes: ['relation_status'],
                    },
                ]
            });

            const reportData = [];
            const priorityOrder = ['Suami', 'Istri', 'Anak', 'Anak Sambung'];

            employees.forEach(employee => {
                const employeeProfile = employee.EmployeeProfile;
                const education = employee.Education.at(-1);
                const relationStatuses = employee.EmployeeFamilies.map(family => family.get('relation_status'));

                const countRelationStatuses = relationStatuses.reduce((acc, val) => {
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                }, {});

                const familyData = priorityOrder
                    .filter(status => countRelationStatuses[status])
                    .map(status => `${countRelationStatuses[status]} ${status}`)
                    .join(' & ') || '-';

                reportData.push({
                    id: employee.id,
                    nik: employee.nik,
                    name: employee.name,
                    is_active: employee.is_active,
                    gender: employeeProfile.gender ?? null,
                    age: `${calculateAge(employeeProfile.date_of_birth)} Years Old`,
                    school_name: education.name,
                    level: education.level,
                    family_data: familyData,
                });
            });

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: reportData
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
}

