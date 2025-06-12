const express = require('express');
const apiRoute = require('./api');
const { notFoundEndpoint, internalServerError } = require('../controllers/errors');

const router = express.Router();

router.use('/api', apiRoute);

router.use(notFoundEndpoint);
router.use(internalServerError);

module.exports = router;