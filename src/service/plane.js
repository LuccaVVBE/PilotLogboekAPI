const { getLogger } = require('../core/logging');
const planeRepository = require('../repository/plane');


const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
}

const getAllFlownPlanes = async (id) => {
    debugLog('Fetching all planes flown by pilot with id ' + id );
    
    const items = await planeRepository.getAllFlownPlanes(id);
    return items;
}

const getPlaneInformation = async (id) => {
    debugLog(`Fetching plane with id ${id}`);
    const plane = await planeRepository.getInfo(id);

    if (!plane) {
        throw new Error(`There is no plane with id ${id}`);
    }

    return plane;
}

const createPlane = async ({Registration, Type, MaxFuel, MaxWeight}) => {
    debugLog('Creating new plane', {Registration, Type, MaxFuel, MaxWeight});
    return await planeRepository.addPlane({
        Registration,
        Type,
        MaxFuel,
        MaxWeight,
    });
}

const editPlane = async ({Registration, Type, MaxFuel, MaxWeight, pilotId}) => {
    debugLog('Editing plane', {Registration, Type, MaxFuel, MaxWeight});
    return await planeRepository.editPlane({
        Registration,
        Type,
        MaxFuel,
        MaxWeight,
        pilotId
    });
}

module.exports = {
    getAllFlownPlanes,
    getPlaneInformation,
    createPlane,
    editPlane,
};
