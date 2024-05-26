const {tables} = require('..');
module.exports = { 
    up: async (knex) => {
        await knex.schema.createTable(tables.flight, (table)=>{
            table.increments('id').primary();
            table.string('timeframe',50).notNullable();
            table.date('date').notNullable();
            table.string('type',50).notNullable();
            table.string('plane',15).references('Registration').inTable(tables.plane).onDelete('SET NULL');
            table.string('departure',15).notNullable();
            table.string('arrival',15).notNullable();
        })
    }
    ,
    down: async (knex) => {
        await knex.schema.dropTableIfExists(tables.flight);
    }
}