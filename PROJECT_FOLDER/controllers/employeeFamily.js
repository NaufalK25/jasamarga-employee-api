const fs = require('fs');
const { validationResult } = require('express-validator');
const { badRequest, internalServerError, notFoundData } = require('./errors');
const { Employee, EmployeeFamily } = require('../database/models');

module.exports = {
    create: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeFamily = await EmployeeFamily.create({
                employee_id: req.body.employee_id,
                name: req.body.name,
                identifier: req.body.identifier,
                job: req.body.job,
                place_of_birth: req.body.place_of_birth,
                date_of_birth: req.body.date_of_birth,
                religion: req.body.religion,
                is_life: req.body.is_life ?? true,
                is_divorced: req.body.is_divorced ?? false,
                relation_status: req.body.relation_status,
                created_by: req.body.created_by ?? 'Admin',
                updated_by: req.body.updated_by ?? 'Admin'
            });

            res.status(201).json({
                statusCode: 201,
                message: 'Employee Family created successfully',
                data: employeeFamily
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    update: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeFamilyId = req.params.id;
            const employeeFamily = await EmployeeFamily.findByPk(employeeFamilyId);

            if (!employeeFamily) return notFoundData(req, res);

            const oldEmployeeFamilyData = { ...employeeFamily.dataValues };
            const employeeFamilyFields = Object.keys(EmployeeFamily.rawAttributes);

            const before = {}, after = {};
            if (req.body) {
                let fieldChanged = Object.keys(req.body).filter(field => employeeFamilyFields.includes(field));

                for (const field of fieldChanged) {
                    before[field] = oldEmployeeFamilyData[field];
                    after[field] = req.body[field];
                }

                await EmployeeFamily.update(after, { where: { id: employeeFamilyId } });
            }

            res.status(200).json({
                statusCode: 200,
                message: 'Employee Family updated successfully',
                data: { before, after }
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    destroy: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeFamilyId = req.params.id;
            const employeeFamily = await EmployeeFamily.findByPk(employeeFamilyId, {
                include: [
                    { model: Employee },
                ]
            });

            if (!employeeFamily) return notFoundData(req, res);

            await EmployeeFamily.destroy({ where: { id: employeeFamilyId } });

            res.status(200).json({
                statusCode: 200,
                message: 'Employee Family deleted successfully',
                data: employeeFamily
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findOne: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeFamily = await EmployeeFamily.findByPk(req.params.id, {
                include: [
                    { model: Employee },
                ]
            });

            if (!employeeFamily) return notFoundData(req, res);

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employeeFamily
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findAll: async (req, res) => {
        try {
            const employeeFamilies = await EmployeeFamily.findAll({
                include: [
                    { model: Employee },
                ]
            });

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employeeFamilies
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
}

