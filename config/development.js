const custom = require('./custom-environment-variables')

module.exports = {
    port: 9000,
    log: {
        level:'debug',
        disabled:false
    },
    cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
    
}