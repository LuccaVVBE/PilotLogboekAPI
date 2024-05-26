const {tables} = require('..');
module.exports = { 
    up: async (knex) => {
        await knex.schema.createTable(tables.license, (table)=>{
            table.increments('id').primary();
            table.string('Type',50).notNullable();
            table.date('ValidFrom').notNullable();
            table.integer('validityInYears').notNullable();
            table.integer('idPilot').unsigned().references('id').inTable(tables.pilot).onDelete('cascade');
        })
    }
    ,
    down: async (knex) => {
        await knex.schema.dropTableIfExists(tables.license);
    }
}