
const custom = require('./custom-environment-variables')



module.exports = {
    log: {
        level:'debug',
        disabled:false
    },
    cors: {
		origins: ['http://localhost:3000', 'https://pilotlogger.onrender.com'],
		maxAge: 3 * 60 * 60,
	},
    
}