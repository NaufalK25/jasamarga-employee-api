const fs = require('fs');
const { validationResult } = require('express-validator');
const { badRequest, internalServerError, notFoundData } = require('./errors');
const { Employee, Education } = require('../database/models');

module.exports = {
    create: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const education = await Education.create({
                employee_id: req.body.employee_id,
                name: req.body.name,
                level: req.body.level,
                description: req.body.description,
                created_by: req.body.created_by ?? 'Admin',
                updated_by: req.body.updated_by ?? 'Admin'
            });

            res.status(201).json({
                statusCode: 201,
                message: 'Education created successfully',
                data: education
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    update: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const educationId = req.params.id;
            const education = await Education.findByPk(educationId);

            if (!education) return notFoundData(req, res);

            const oldEducationData = { ...education.dataValues };
            const educationFields = Object.keys(Education.rawAttributes);

            const before = {}, after = {};
            if (req.body) {
                let fieldChanged = Object.keys(req.body).filter(field => educationFields.includes(field));

                for (const field of fieldChanged) {
                    before[field] = oldEducationData[field];
                    after[field] = req.body[field];
                }

                await Education.update(after, { where: { id: educationId } });
            }

            res.status(200).json({
                statusCode: 200,
                message: 'Education updated successfully',
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

            const educationId = req.params.id;
            const education = await Education.findByPk(educationId, {
                include: [
                    { model: Employee },
                ]
            });

            if (!education) return notFoundData(req, res);

            await Education.destroy({ where: { id: educationId } });

            res.status(200).json({
                statusCode: 200,
                message: 'Education deleted successfully',
                data: education
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findOne: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const education = await Education.findByPk(req.params.id, {
                include: [
                    { model: Employee },
                ]
            });

            if (!education) return notFoundData(req, res);

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: education
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findAll: async (req, res) => {
        try {
            const educations = await Education.findAll({
                include: [
                    { model: Employee },
                ]
            });

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: educations
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
}

