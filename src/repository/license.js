const {tables, getKnex} = require('../data/index');


const getAll = async (id) => {

    return await getKnex()(tables.license).where('idPilot', id);
}

const createLicense = async ({
    idPilot,
    type,
    validityInYears,
    validFrom
    }) => {
        try {
            await getKnex()(tables.license).insert({
                idPilot,
                Type:type,
                ValidFrom: new Date(validFrom),
                validityInYears
            })
        } catch (error) {
            throw new Error("Error creating license", error)
        }
    }

    const getPilotFromLicenseById = async (licenseId) => {
        const pilotId = await getKnex()(tables.license).select('idPilot').where('id', licenseId);
        return pilotId[0].idPilot;
    }

    const deleteLicense = async (licenseId) => {
        try {
            await getKnex()(tables.license).where('id', licenseId).del();
        } catch (error) {
            throw new Error("Error deleting license", error)
        }
    }

module.exports = {
    getAll,
    createLicense,
    getPilotFromLicenseById,
    deleteLicense
};