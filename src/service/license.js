const { getLogger } = require('../core/logging');
const licenseRepository = require('../repository/license');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
}

const getAll = async (id) => {
    debugLog('Fetching all licenses');
    const items = await licenseRepository.getAll(id);
    return items;
}


const createLicense = async ({idPilot, Type, validityInYears, ValidFrom}) => {
    debugLog('Creating new license', {idPilot, Type, validityInYears, ValidFrom});
    await licenseRepository.createLicense({
        idPilot,
        type:Type,
        validityInYears,
        validFrom:ValidFrom
    });
}

const deleteLicense = async ({idPilot, licenseId}) => {
    debugLog('Deleting license', {idPilot, licenseId});
    if(await getPilotFromLicenseByLicenseId(licenseId) === idPilot){
        await licenseRepository.deleteLicense(licenseId);
    }
    else{
        throw new Error('Not authorized');
    }
}

const getPilotFromLicenseByLicenseId = async (licenseId) => {
    const pilotId = await licenseRepository.getPilotFromLicenseById(licenseId);
    return pilotId;
}

module.exports = {
    getAll,
    createLicense,
    deleteLicense,
};