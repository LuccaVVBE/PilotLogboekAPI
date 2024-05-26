const {tables} = require('..');
module.exports = {
	seed: async (knex) => {
		// first delete all entries
		const exists = await knex.schema.hasTable(tables.pilot);
        if(exists){
		await knex(tables.pilot).delete();
        }
		

		// then add the fresh places
		await knex(tables.pilot).insert([
		{ fName: 'Lucca', lName: "Van Veerdeghem", birthday: '2003-05-02', auth0id: 'auth0|60f5b1b2b0baerdfsd1b0b1b' },
		{ fName: 'John', lName: "Doe", birthday: '2000-10-02', auth0id: 'auth0|60f5b1b2b0bqdfqdsfdq1b' },
		{ fName: 'Jan', lName: "Janssens", birthday: '1995-02-10', auth0id: 'auth|60f5b1516156841b2b0b1b1b' },
	]);
	},
};