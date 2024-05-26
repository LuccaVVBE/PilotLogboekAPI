const {tables} = require('..');
module.exports = { 
    up: async (knex) => {
        await knex.schema.createTable(tables.plane, (table)=>{
            table.string('Registration',15).primary();
            table.string('Type',50);
            table.integer('MaxFuel');
            table.integer('MaxWeight');
        })
    }
    ,
    down: async (knex) => {
        await knex.schema.dropTableIfExists(tables.plane);
    }
}