const config = require('config')
const knex = require('knex')
const {getLogger} = require('../core/logging')

const DATABASE_CLIENT = config.get('DB_CLIENT');
const DATABASE_NAME = config.get('DB_NAME');
const DATABASE_HOST = config.get('DB_HOST');
const DATABASE_PORT = config.get('DB_PORT');
const DATABASE_USERNAME = config.get('DB_USER');
const DATABASE_PASSWORD = config.get('DB_PASS');
const isDevelopment = config.get('env')=== 'development';
const isTest = config.get('env')=== 'test';

let knexInstance;

function getKnex(){
    if(!knexInstance) throw new Error('You must first initialize the data layer');
    return knexInstance
}

async function initializeData(){
    const logger = getLogger();
    let knexOptions = {
        client: DATABASE_CLIENT,
        connection: {
          host: DATABASE_HOST,
          port: DATABASE_PORT,
          user: DATABASE_USERNAME,
          password: DATABASE_PASSWORD,
        },
        debug: false,
        migrations: {
            directory: './src/data/migrations',
            tableName: 'knex_meta'
        },
        seeds: {
            directory: './src/data/seeds'
        }
    }
    knexInstance = knex(knexOptions)

    

    try{
        await knexInstance.raw('SELECT 1+1 AS result');
        if(isDevelopment ||isTest){
            await knexInstance.raw('DROP DATABASE IF EXISTS ' + DATABASE_NAME);
        }
        await knexInstance.raw('CREATE DATABASE IF NOT EXISTS '+DATABASE_NAME);
        await knexInstance.destroy();
    
        knexOptions.connection.database = DATABASE_NAME;
        knexInstance = knex(knexOptions);
        await knexInstance.raw('SELECT 1+1 AS result');
    }catch(error){
        logger.error("not established")
        logger.error(error)
        return;
    }
    logger.info("established")

    
      

    //run migrations
    let migrationFailed = true
    try{
        await knexInstance.migrate.latest();
        migrationFailed = false
    }catch(error){
        logger.error(error)
    }
    if(migrationFailed){
        try{
            await knexInstance.migrate.down();
        }catch(error){
            logger.error(error)
        }
        }
    //run seeds
    if(isDevelopment ){
    try{
        await knexInstance.seed.run();
        logger.info('seeds completed')
    }catch(error){
        logger.error(error)
    }
    }

    return knexInstance;
}

async function shutdownData() {
    const logger = getLogger();
  
    logger.info('Shutting down database connection');
    knexInstance = null;
  
    logger.info('Database connection closed');
  }

const tables = Object.freeze({
    pilot: 'pilot',
    license: 'license',
    flight:'flight',
    flightdetails:'flightdetails',
    plane:'plane'
})

module.exports = {
    initializeData,
    getKnex,
    tables,
    shutdownData
}
