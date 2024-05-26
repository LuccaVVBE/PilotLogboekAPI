const Router = require('@koa/router');
const { addUserInfo } = require('../core/auth');
const flightService = require('../service/flight');
const pilotService = require('../service/pilot');
const Joi = require('joi');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');

const getPilot = async (ctx) => {
	try{
	const pilot = await pilotService.getByAuth0Id(ctx.state.user.sub);
	return pilot;
	} catch(error){
		throw ServiceError.unauthorized('Not Authorized, please log in',error.message);
	}	
};

const getAllFlights = async (ctx) => {
	
	const pilot = await getPilot(ctx);
	try{
	const flights = await flightService.getAll(pilot.id);
	ctx.body = flights? flights : [];
	} catch(error){
		throw ServiceError.forbidden('Error in getting all flights',error.message);
	}
};

const createFlight = async (ctx) => {

	const user = await getPilot(ctx);
	try{
	const userId = user.id;
	const newFlight = await flightService.createFlight({
		...ctx.request.body,
		userId,
	});
	ctx.body = newFlight;
	} catch(error){
		throw ServiceError.forbidden('Error in creating flight',error.message);
	}
};
createFlight.validationScheme = {
	body: {
		timeframe: Joi.string().required(),
		date: Joi.date().required(),
		type: Joi.string().required(),
		plane: Joi.string().required(),
		departure: Joi.string().required(),
		arrival: Joi.string().required(),
		PIC: Joi.number().integer().optional(),
		COPIC: Joi.number().integer().optional(),
	},
};


const getAmountPerCategory = async (ctx) => {
	
	const pilot = await getPilot(ctx);
	try{
	ctx.body = await flightService.getAmountPerCategory(pilot.id);
	} catch(error){
		throw ServiceError.validationFailed('Error in getting flights per category',error.message);
	}
};

const getFlightById = async (ctx) => {
	try{
	ctx.body = await flightService.getById(ctx.params.id);
	} catch(error){
		throw ServiceError.validationFailed('Error in getting flight by id',error.message);
	}
};
getFlightById.validationScheme = {
	params: Joi.object({
		id: Joi.number().integer().required(),
	}),
};

const updateFlight = async (ctx) => {
	
	const user = await getPilot(ctx);
	try{
	ctx.body = await flightService.updateById({ 
		...ctx.request.body,
		userId:user.id,
	});
	} catch(error){
		throw ServiceError.forbidden('Error in updating flight',error.message);
	}
};
updateFlight.validationScheme = { 
		body:{
			id: Joi.number().integer().required(),
			timeframe: Joi.string().required(),
			date: Joi.date().required(),
			type: Joi.string().required(),
			plane: Joi.string().required(),
			departure: Joi.string().required(),
			arrival: Joi.string().required(),
			PIC: Joi.number().integer().optional(),
			COPIC: Joi.number().integer().optional(),
		}
	};

const deleteFlight = async (ctx) => {
	
		const id = ctx.params.id;
		const user = await getPilot(ctx);
		try{
		await flightService.deleteById({id, userId:user.id});
		ctx.status=204;
	} catch(error){
		throw ServiceError.forbidden('Error in deleting flight',error.message);
	}
};
deleteFlight.validationScheme = {
	params: Joi.object({
		id: Joi.number().integer().required(),
	}),
};

const flightStats = async (ctx) => {

	const pilot = await getPilot(ctx);
	try{
	ctx.body = await flightService.getStats(pilot.id);
	} catch(error){
		throw ServiceError.validationFailed('Error in getting flight stats',error.message);
	}
};


module.exports = (app) => {
	const router = new Router({
		prefix: '/flights',
	});

	router.get('/', getAllFlights);
	router.post('/', validate(createFlight.validationScheme),createFlight);
	router.get('/categories/', getAmountPerCategory);
	router.get('/info/:id', validate(getFlightById.validationScheme),getFlightById);
	router.put('/update/', validate(updateFlight.validationScheme),updateFlight);
	router.delete('/:id', validate(deleteFlight.validationScheme),deleteFlight);
	router.get('/stats/', flightStats);

	app.use(router.routes()).use(router.allowedMethods());
};
