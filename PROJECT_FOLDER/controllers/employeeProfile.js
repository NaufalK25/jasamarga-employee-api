const { validationResult } = require('express-validator');
const { badRequest, internalServerError, notFoundData } = require('./errors');
const { Employee, EmployeeProfile } = require('../database/models');
const { deleteFile } = require('../helper');

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
const unlinkProfilePicturePath = `${__dirname}/../uploads/profiles/`;
const jsonProfilePicturePath = `${baseUrl}/uploads/profiles/`;

module.exports = {
    create: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const profilePicture = req.file ? req.file.filename : 'default_profile.png'

            const employeeProfile = await EmployeeProfile.create({
                employee_id: req.body.employee_id,
                place_of_birth: req.body.place_of_birth,
                date_of_birth: req.body.date_of_birth,
                gender: req.body.gender,
                is_married: req.body.is_married,
                prof_pict: profilePicture,
                created_by: req.body.created_by ?? 'Admin',
                updated_by: req.body.updated_by ?? 'Admin'
            });

            res.status(201).json({
                statusCode: 201,
                message: 'Employee Profile created successfully',
                data: employeeProfile
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    update: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeProfileId = req.params.id;
            const employeeProfile = await EmployeeProfile.findByPk(employeeProfileId, {
                include: [
                    { model: Employee },
                ]
            });

            if (!employeeProfile) return notFoundData(req, res);

            const profilePicture = req.file ? req.file.filename : undefined;

            const requestBody = { ...req.body };

            if (profilePicture) requestBody.prof_pict = profilePicture;

            const oldEmployeeProfileData = { ...employeeProfile.dataValues };
            const employeeProfileFields = Object.keys(EmployeeProfile.rawAttributes);

            const before = {}, after = {};
            if (requestBody) {
                let fieldChanged = Object.keys(requestBody).filter(field => employeeProfileFields.includes(field));

                for (const field of fieldChanged) {
                    before[field] = oldEmployeeProfileData[field];
                    after[field] = requestBody[field];
                }

                if (req.file && oldEmployeeProfileData.profilePicture !== 'default_profile.png') {
                    deleteFile(`${unlinkProfilePicturePath}${oldEmployeeProfileData.prof_pict}`);
                }

                await EmployeeProfile.update(after, { where: { id: employeeProfileId } });

                if (before.profilePicture && after.profilePicture) {
                    before.profilePicture = `${jsonProfilePicturePath}${before.profilePicture}`;
                    after.profilePicture = `${jsonProfilePicturePath}${after.profilePicture}`;
                }
            }

            res.status(200).json({
                statusCode: 200,
                message: 'Employee Profile updated successfully',
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

            const employeeProfileId = req.params.id;
            const employeeProfile = await EmployeeProfile.findByPk(employeeProfileId, {
                include: [
                    { model: Employee },
                ]
            });

            if (!employeeProfile) return notFoundData(req, res);

            if (employeeProfile) {
                const profilePicture = employeeProfile.prof_pict;

                if (profilePicture !== 'default_profile.png') {
                    deleteFile(`${unlinkProfilePicturePath}${profilePicture}`);
                }
            }

            await EmployeeProfile.destroy({ where: { id: employeeProfileId } });

            res.status(200).json({
                statusCode: 200,
                message: 'Employee Profile deleted successfully',
                data: employeeProfile
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findOne: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return badRequest(errors.array(), req, res);

            const employeeProfile = await EmployeeProfile.findByPk(req.params.id, {
                include: [
                    { model: Employee },
                ]
            });

            if (!employeeProfile) return notFoundData(req, res);

            if (employeeProfile) {
                const profilePicture = employeeProfile.prof_pict;
                employeeProfile.prof_pict = `${jsonProfilePicturePath}${profilePicture}`;
            }

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employeeProfile
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
    findAll: async (req, res) => {
        try {
            const employeeProfiles = await EmployeeProfile.findAll({
                include: [
                    { model: Employee },
                ]
            });

            employeeProfiles.forEach(employeeProfile => {
                if (employeeProfile) {
                    const profilePicture = employeeProfile.prof_pict;
                    employeeProfile.prof_pict = `${jsonProfilePicturePath}${profilePicture}`;
                }
            });

            res.status(200).json({
                statusCode: 200,
                message: 'OK',
                data: employeeProfiles
            });
        } catch (err) {
            return internalServerError(err, req, res);
        }
    },
}
