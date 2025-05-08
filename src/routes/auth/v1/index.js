const router = require('express').Router();

const { routesConfig } = require('../../../libs/configs');
const user = require('./user.route');


const { routes } = routesConfig.auth.versions.v1;

router.use(routes.user.path, user);

module.exports = router;
