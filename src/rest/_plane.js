const Router = require('@koa/router');
const planeService = require('../service/plane');
const pilotService = require('../service/pilot');
const Joi = require('joi');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');


const getAllFlownPlanes = async (ctx) => {
    try{
    const pilot = await pilotService.getByAuth0Id(ctx.state.user.sub);
    ctx.body = await planeService.getAllFlownPlanes(pilot.id);
    } catch (error) {
        throw ServiceError.validationFailed('Error in getting all flown planes',error.message);
    }
}

const getPlaneById = async (ctx) => {
    try{
    ctx.body = await planeService.getPlaneInformation(ctx.params.id);
    } catch (error) {
        throw ServiceError.validationFailed('Error in getting plane information',error.message);
    }

}
getPlaneById.validationScheme = {
    params: {
        id: Joi.string().required(),
    }
}


const createPlane = async (ctx) => {
    try{
    ctx.body = await planeService.createPlane({
        ...ctx.request.body
    });
    } catch (error) {
        throw ServiceError.validationFailed('Error in creating plane',error.message);
    }
}
createPlane.validationScheme = {
    body: {
        Registration: Joi.string().required(),
        Type: Joi.string().optional(),
        MaxFuel: Joi.number().integer().optional(),
        MaxWeight: Joi.number().integer().optional()
    }
}

const editPlane = async (ctx) => {
    try{
    const pilot = await pilotService.getByAuth0Id(ctx.state.user.sub);
    ctx.body = await planeService.editPlane({
        ...ctx.request.body,
        pilotId: pilot.id
    });
    } catch (error) {
        throw ServiceError.validationFailed('Error in editing plane',error.message);
    }
}
editPlane.validationScheme = {
    body: {
        Registration: Joi.string().required(),
        Type: Joi.string().optional(),
        MaxFuel: Joi.number().integer().optional(),
        MaxWeight: Joi.number().integer().optional()
    }
}

module.exports = (app) => {
    const router = new Router({
        prefix: '/planes',
    });

    router.get('/', getAllFlownPlanes);
    router.post('/', validate(createPlane.validationScheme),createPlane);
    router.get('/info/:id', validate(getPlaneById.validationScheme), getPlaneById);
    router.put('/edit/', validate(editPlane.validationScheme),editPlane)

    app.use(router.routes()).use(router.allowedMethods());
}

