const { getLogger } = require('../core/logging');
const flightRepository = require('../repository/flight');


const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};


const getAll = async (id) => {
    try{
	debugLog('Fetching all flights');
	const items = await flightRepository.getAll(id);
	return items;
    } catch(error){
        throw new Error("Problem occured while fetching data. Please try again later.")
    }
};


const getAmountPerCategory = async (id) => {
    debugLog('Fetching all flights per category');
    const arrayOfItems = await flightRepository.getAmountPerCategory(id);
    return arrayOfItems;
    };

const getById = async (id) => {
	debugLog(`Fetching flight with id ${id}`);
	const flight = await flightRepository.getById(id);

	if (!flight) {
		throw new Error(`There is no flight with id ${id}`);
	}

	return flight;
};


const createFlight = async ({timeframe, date, type, plane, departure, arrival, PIC, COPIC, userId}) => {
	debugLog('Creating new flight', { timeframe, date, type, plane, departure, arrival, PIC, COPIC, userId });
    if(PIC===''||PIC===null){
        PIC=undefined;
    }
    if(COPIC===''||COPIC===null){
        COPIC=undefined;
    }
    if(PIC === undefined && COPIC === undefined){
        throw new Error('You need at least one pilot');
    }
	if(userId !== PIC && userId !== COPIC) {
        throw new Error('You are not allowed to create a flight for this pilot');
    }
    
	return await flightRepository.createFlight({
		timeframe,
        date,
        type,
        plane,
        departure,
        arrival,
        PIC,
        CoPilot: COPIC,
	});
	
};

const getStats = async (id) => {
    debugLog('Fetching all stats');
    const list = await flightRepository.getAll(id);

    const items = [
        list.filter(flight => flight.date.getMonth() === new Date().getMonth() && flight.date.getFullYear()===new Date().getFullYear()).length,
        list.filter(flight => flight.date.getYear() === new Date().getYear()).length,
        list.length,
    ];
    return items;
    };


const updateById = async ({
    id,
    timeframe,
    date,
    type,
    plane,
    departure,
    arrival,
    PIC,
    CoPilot,
    userId
}) => {
	debugLog(`Updating flight with id ${id}`);
    if(PIC===''||PIC===null){
        PIC=undefined;
    }
    if(CoPilot===''||CoPilot===null){
        CoPilot=undefined;
    }
    if(PIC === undefined && CoPilot === undefined){
        throw new Error('You need at least one pilot');
    }
	if(userId !== PIC && userId !== CoPilot) {
        throw new Error('You are not allowed to update a flight for this pilot');
    }
 	await flightRepository.updateById({
        id,
        timeframe,
        date,
        type,
        plane,
        departure,
        arrival,
        PIC,
        CoPilot,
	});
	return getById(id);
};


const deleteById = async ({id, userId}) => {
	debugLog(`Deleting flight with id ${id}`);
    const flight = await flightRepository.getById(id);
    if(!flight){
        throw new Error('There is no flight with id ' +id);
    }
    if(userId !== flight.PIC && userId !== flight.CoPilot) {
        throw new Error('You are not allowed to delete this flight');
    }
	await flightRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
    getAmountPerCategory,
    createFlight,
	updateById,
	deleteById,
    getStats,
};
