const router = require('express').Router();

const { routesConfig } = require('../libs/configs');
const auth = require('./auth');



router.use(routesConfig.auth.path, auth);
module.exports = router;
