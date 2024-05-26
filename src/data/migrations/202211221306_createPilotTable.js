const {tables} = require('..');
module.exports = { 
    up: async (knex) => {
        await knex.schema.createTable(tables.pilot, (table)=>{
            table.increments('id').primary();
            table.string('fName', 25).notNullable();
            table.string('lName', 50).notNullable();
            table.date('birthday');
            table.string('auth0id', 255).notNullable();
            table.unique('auth0id');
        })
    }
    ,
    down: async (knex) => {
        await knex.schema.dropTableIfExists(tables.pilot);
    }
}