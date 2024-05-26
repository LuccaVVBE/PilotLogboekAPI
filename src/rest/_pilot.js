const Router = require('@koa/router');
const pilotService = require('../service/pilot');
const { addUserInfo } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');

const getPilot = async (ctx) => {
  try {
    const pilot = await pilotService.getByAuth0Id(ctx.state.user.sub);
    return pilot;
  } catch (error) {
    throw ServiceError.unauthorized('Not Authorized, please log in', error.message);
  }
};

const getAllPilots = async (ctx) => {
  
    await getPilot(ctx);
    try {
    ctx.body = await pilotService.getAll();
  } catch (error) {
    throw ServiceError.forbidden('Error in getting all pilots', error.message);
  }
};

const getPilotById = async (ctx) => {
  ctx.body = await getPilot(ctx);
};

const createPilot = async (ctx) => {
  let user;
  let fName, lName;
  try {
    user = await getPilot(ctx);
  } catch (error) {
    try{
    await addUserInfo(ctx);
    
    const name = ctx.state.user.name;
    if (name.split(' ').length > 1) {
      const indexSpatie = name.indexOf(' ');
      [fName, lName] = [name.slice(0, indexSpatie), name.slice(indexSpatie + 1)];
    } else {
      let name = ctx.state.user.name.split('@')[0];
      if (name.split('.').length > 1) {
        const indexPunt = name.indexOf('.');
        [fName, lName] = [name.slice(0, indexPunt), name.slice(indexPunt + 1)];
      } else {
        fName = name;
        lName = '';
      }
    }
    } catch (error) {
      throw ServiceError.forbidden('Error in creating pilot', error.message);
      
    }
    user = await pilotService.createPilot({
      auth0id: ctx.state.user.sub,
      fName,
      lName,
    });
  }
  const pilot = await pilotService.getPilotInformation(user.id);
  ctx.body = pilot;
  
};

const updatePilot = async (ctx) => {
  
    const pilot = await getPilot(ctx);
    try {
    await pilotService.updatePilot(pilot.id, { ...ctx.request.body });
    ctx.status=204;
  } catch (error) {
    throw ServiceError.forbidden('Error in updating pilot', error);
  }
};
updatePilot.validationScheme = {
    body: {
        fName: Joi.string().required(),
        lName: Joi.string().optional(),
        birthday: Joi.date().optional()
    }
}


module.exports = (app) => {
  const router = new Router({
    prefix: '/pilots',
  });

  router.get('/', getAllPilots);
  router.get('/info', getPilotById);
  router.get('/register/', createPilot);
  router.put('/update', validate(updatePilot.validationScheme),updatePilot);

  app.use(router.routes()).use(router.allowedMethods());
};
