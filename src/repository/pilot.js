const {tables, getKnex} = require('../data/index');
const {getLogger} = require('../core/logging');
const { getById } = require('./flight');

const findByAuth0Id = async (auth0id) => {
    return await getKnex()(tables.pilot)
      .where('auth0id', auth0id)
      .first();
  };

const getAll = async () => {
    return getKnex()(tables.pilot);
};

const getPilotInformation = async (id) => {
    return await getKnex()(tables.pilot).where('pilot.id', id).first();

}

const createPilot = async ({
    fName,
    lName,
    birthday,
    auth0id
    }) => {
        try {
            const id = await getKnex()(tables.pilot).insert({
                fName,
                lName,
                birthday,
                auth0id
            },'id');
            return await getPilotInformation(id[0])
        } catch (error) {
            throw new Error("Error creating pilot", error)
        }
    }

    const updatePilot = (id, {fName, lName, birthday})=>{
        return getKnex()(tables.pilot)
            .where('id', id)
            .update({
                fName,
                lName,
                birthday: new Date(birthday)
            });
    };


module.exports = {
    getAll,
    getPilotInformation,
    createPilot,
    findByAuth0Id,
    updatePilot
};