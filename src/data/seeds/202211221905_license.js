const {tables} = require('..');
module.exports = {
	seed: async (knex) => {
		// first delete all entries
		const exists = await knex.schema.hasTable(tables.license);
        if(exists){
		await knex(tables.license).delete();
        }
		

		// then add the fresh places
		await knex(tables.license).insert([
		{ Type: 'Medical', ValidFrom: '2021-11-22', validityInYears: 5, idPilot: 1 },
		{ Type: 'PPL', ValidFrom: '2021-11-22', validityInYears:0, idPilot: 1 },
		{ Type: 'Medical', ValidFrom: '2021-11-22', validityInYears: 5, idPilot: 2 }
	]);
	},
};