const {tables} = require('..');
module.exports = { 
    up: async (knex) => {
        await knex.schema.createTable(tables.flightdetails, (table)=>{
            table.increments('id').primary();
            table.integer('PIC').unsigned().references('id').inTable(tables.pilot).onDelete('SET NULL');
            table.integer('CoPilot').unsigned().references('id').inTable(tables.pilot).onDelete('SET NULL');
            table.integer('flight').unsigned().references('id').inTable(tables.flight).onDelete('cascade');
        })
    }
    ,
    down: async (knex) => {
        await knex.schema.dropTableIfExists(tables.flightdetails);
    }
}