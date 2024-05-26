const Router = require('@koa/router');
const installFlightRouter = require('./_flight');
const installPilotRouter = require('./_pilot');
const installLicenseRouter = require('./_license');
const installPlaneRouter = require('./_plane');



module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installFlightRouter(router);
	installPilotRouter(router);
	installLicenseRouter(router);
	installPlaneRouter(router);


	app.use(router.routes()).use(router.allowedMethods());
};
