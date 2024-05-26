const custom = require('./custom-environment-variables')

module.exports = {
    env: 'NODE_ENV',
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_NAME: 'DB_NAME',
    DB_CLIENT: 'DB_CLIENT',

    log: {
        level:'debug',
        disabled:false
    },
    cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
    
}