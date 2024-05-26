const {tables} = require('..');
module.exports = {
	seed: async (knex) => {
		// first delete all entries
		const exists = await knex.schema.hasTable(tables.flightdetails);
        if(exists){
		await knex(tables.flightdetails).delete();
        }
		

		// then add the fresh places
		await knex(tables.flightdetails).insert([
		{ PIC: 1, flight: 1 },
		{ PIC: 1, CoPilot: 2, flight: 2 },
		{ PIC: 1, CoPilot:3, flight: 3 } 
	]);
	},
};