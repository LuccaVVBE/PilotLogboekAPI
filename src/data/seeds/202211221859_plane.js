const {tables} = require('..');
module.exports = {
	seed: async (knex) => {
		// first delete all entries
		const exists = await knex.schema.hasTable(tables.plane);
        if(exists){
			await knex(tables.plane).delete();
        }
		

		// then add the fresh places
		await knex(tables.plane).insert([
		{ Registration: 'OO-VMC', Type: 'Piper Warrior III', MaxFuel: 48, MaxWeight: 1110 },
		{ Registration: 'OO-VMY', Type: 'Piper Warrior III',  MaxWeight: 1110 },
		{ Registration: 'OO-EBU', Type: 'Piper Warrior III', MaxFuel: 48 }
	]);
	},
};