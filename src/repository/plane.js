const {tables, getKnex} = require('../data/index');

const getInfo = async (id) => {
    return await getKnex()(tables.plane).where('Registration', id).first();
}

const getAllFlownPlanes = async (pilotId) => {
    const flightIdList = await getKnex()(tables.flightdetails).where('PIC', pilotId).orWhere('CoPilot', pilotId).select('flight');
    let list = [];
    flightIdList.forEach(flight => {
        list.push(flight.flight);
    });
    const planeList = await getKnex()(tables.flight).whereIn('id', list).select('plane').distinct();
    let planes = [];
    planeList.forEach(plane => {
        planes.push(plane.plane);
    });
    return await getKnex()(tables.plane).whereIn('Registration', planes);
}

const addPlane = async ({
    Registration,
    Type,
    MaxFuel,
    MaxWeight
    }) => {
        try {
            await getKnex()(tables.plane).insert({
                Registration,
                Type,
                MaxFuel,
                MaxWeight
            })
            return await getInfo(Registration);
        } catch (error) {
            throw new Error("Could not create plane, registration already exists")
        }
    }

    const editPlane = async ({
        Registration,
        Type,
        MaxFuel,
        MaxWeight,
        pilotId
        }) => {
            try {
            const listOfFlightsWithRegistrationOfPilot = await getAllFlownPlanes(pilotId);
            if(!listOfFlightsWithRegistrationOfPilot.filter(flight => flight.Registration === Registration)){
                throw new Error("You are not allowed to edit this plane");
            }
            if(!await getInfo(Registration)){
                throw new Error("Plane does not exist");
            }
                await getKnex()(tables.plane).where('Registration', Registration).update({
                    Type,
                    MaxFuel,
                    MaxWeight
                })
                return await getInfo(Registration);
            } catch (error) {
                throw new Error("Could not edit plane, are all datatypes correct?")
            }
        }

    module.exports = {
        getInfo,
        addPlane,
        getAllFlownPlanes,
        editPlane,
    }