const {tables} = require('..');
module.exports = {
	seed: async (knex) => {
		// first delete all entries
		const exists = await knex.schema.hasTable(tables.flight);
        if(exists){
		await knex(tables.flight).delete();
        }
		

		// then add the fresh places
		await knex(tables.flight).insert([
		{ timeframe: '08:00 - 09:00', date: '2021-11-22', type: 'Training', plane:'OO-EBU', departure: 'EBBR', arrival: 'EBCI'},
		{ timeframe: '09:00 - 10:00', date: '2021-11-22', type: 'Training', plane:'OO-VMY', departure: 'EBCI', arrival: 'EBOS'},
		{ timeframe: '10:00 - 11:00', date: '2021-11-22', type: 'Training', plane:'OO-VMC', departure: 'EBOS', arrival: 'EBUL'},
	]);
	},
};