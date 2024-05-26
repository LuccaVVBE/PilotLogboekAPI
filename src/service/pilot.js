const { getLogger } = require('../core/logging');
const pilotRepository = require('../repository/pilot');


const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
}

const getAll = async () => {
    debugLog('Fetching all pilots');
    const items = await pilotRepository.getAll();
    return items;
}

const getPilotInformation = async (id) => {
    debugLog(`Fetching pilot with id ${id}`);
    const pilot = await pilotRepository.getPilotInformation(id);

    if (!pilot) {
        throw new Error(`There is no pilot with id ${id}`);
    }

    return pilot;
}

const createPilot = async ({fName, lName, birthday, auth0id}) => {
    debugLog('Creating new pilot', {fName, lName, birthday});
    if(!await pilotRepository.findByAuth0Id(auth0id)){
    return await pilotRepository.createPilot({
        fName,
        lName,
        birthday,
        auth0id
    });

    }
}

const getByAuth0Id = async (auth0id) => {
    debugLog(`Fetching user with auth0id ${auth0id}`);
    const user = await pilotRepository.findByAuth0Id(auth0id);
  
    if (!user) {
      throw new Error(`No user with id ${auth0id} exists srvc/plt.js/42`);
    }
  
    return user;
    
  };

  const updatePilot = async (id, {fName, lName, birthday}) => {
    debugLog(`Updating pilot with id ${id}`, {fName, lName, birthday});
    await pilotRepository.updatePilot(id, {fName, lName, birthday});
    };



module.exports = {
    getAll,
    getPilotInformation,
    createPilot,
    getByAuth0Id,
    updatePilot
};