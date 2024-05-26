const Router = require('@koa/router');
const licenseService = require('../service/license');
const pilotService = require('../service/pilot');
const Joi = require('joi');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');


const getPilot = async (ctx) => {
	try{
	const pilot = await pilotService.getByAuth0Id(ctx.state.user.sub);
	return pilot;
	} catch(error){
		throw ServiceError.unauthorized('Not Authorized, please log in', error.message);
	}
};

const getAllLicenses = async (ctx) => {
  
    const user = await getPilot(ctx);
    try{
    ctx.body = await licenseService.getAll(user.id);
    } catch(error){
        throw ServiceError.validationFailed('Error in getting all licenses', error.message);
    }

}

const createLicense = async (ctx) => {
  
    const pilot = await getPilot(ctx);
    try{
    const idPilot = pilot.id;
    ctx.body = await licenseService.createLicense({
        ...ctx.request.body,
        idPilot,
    });
    } catch(error){
        throw ServiceError.forbidden('Error in creating license', error.message);
    }
}
createLicense.validationScheme = {
    body: {
        Type: Joi.string().required(),
        validityInYears: Joi.number().integer().required(),
        ValidFrom: Joi.date().required(),
    }
}


const deleteLicense = async (ctx) => {
   
    const pilot = await getPilot(ctx)
    try{
    const idPilot = pilot.id;
    ctx.body = await licenseService.deleteLicense({
        idPilot,
        licenseId: ctx.params.id,
    });
    } catch(error){
        throw ServiceError.validationFailed('Error in deleting license', error.message);
    }
}
deleteLicense.validationScheme = {
    params: {
        id: Joi.number().integer().required(),
    }
}


module.exports = (app) => {
    const router = new Router({
        prefix: '/licenses',
    });

    router.get('/', getAllLicenses);
    router.post('/', validate(createLicense.validationScheme),createLicense);
    router.delete('/:id', validate(deleteLicense.validationScheme),deleteLicense);

    app.use(router.routes()).use(router.allowedMethods());
}
