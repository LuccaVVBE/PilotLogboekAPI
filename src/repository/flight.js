const { tables, getKnex } = require('../data/index');

const getAll = async(id) => {
  const result = await getKnex()(tables.flightdetails).select('flight').where('PIC', id).orWhere('CoPilot', id)
  const list = result.map((item) => item.flight);
  return await getKnex()(tables.flight)
    .whereIn('id', list)
    .orderBy('date', 'DESC')
    .orderBy('timeframe', 'DESC');
};

const getAmountPerCategory = async(id) => {

  let result = [];
  
  const allFlights = await getKnex()(tables.flightdetails).select('flight').where('PIC', id).orWhere('CoPilot', id)
  const list = allFlights.map((item) => item.flight);
  const training = await getKnex()(tables.flight).count('type').whereIn('id',list).where('type', 'Training').first();
  const local = await getKnex()(tables.flight).count('type').whereIn('id',list).where('type', 'Local').first();
  const navigation = await getKnex()(tables.flight).count('type').whereIn('id',list).where('type', 'Navigation').first();
  
  result[0] = Object.values(local)[0];
  result[1] = Object.values(navigation)[0];
  result[2] = Object.values(training)[0];

  return result;
};


const getById = async(id) => {
  return await getKnex()(tables.flight).join('flightdetails', 'flight.id', '=', 'flightdetails.flight').where('flight.id', id)
    .first();
};




const createFlight = async ({
    timeframe,
    date,
    type,
    plane,
    departure,
    arrival,
    PIC,
    CoPilot,
}) => {
    try {
      let id;
        await getKnex().transaction(async trx => {
      
          
          if(!await trx(tables.plane).where('registration', plane).first()){
            await trx(tables.plane).insert({
              registration: plane,
          })
          }

          id = await trx('flight')
            .insert({
                timeframe,
                date: new Date(date),
                type,
                plane,
                departure,
                arrival
            
            }, 'id')
      
          
          await trx('flightdetails').insert({
            flight: id,
            PIC,
            CoPilot
            })
          
        })
        return await getKnex()(tables.flight).where('id', id).first();
      } catch (error) {
        // An error will result in the flight not being saved
        throw new Error("Error while creating flight!")
      }
};

//nog aan te passen.
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
}) => {
  try {
    if(!id){
      throw new Error("I need an id to update the flight!")
    }
    await getKnex().transaction(async trx => {

      if(!await trx(tables.plane).where('registration', plane).first()){
            await trx(tables.plane).insert({
              registration: plane,
          })
          }

      await trx(tables.flight)
      .update({
        timeframe,
        date:new Date(date),
        type,
        plane,
        departure,
        arrival,
      })
      .where('id', id);

      await trx(tables.flightdetails)
      .update({
        PIC,
        CoPilot,
      })
      .where('flight', id);
    })
  } catch (error) {
    throw error;
  }
};


const deleteById = async (id) => {
  try {
    await getKnex()(tables.flight).where('id', id).del();
  } catch (error) {
    throw error;
  }
};




module.exports = {
  getAll,
  getById,
  getAmountPerCategory,
  createFlight,
  updateById,
  deleteById,
  
};
