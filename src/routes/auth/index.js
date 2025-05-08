const router = require('express').Router();

const { routesConfig } = require('../../libs/configs');
const v1 = require('./v1');
const { versions } = routesConfig.auth;

router.use(versions.v1.path, v1);

module.exports = router;
