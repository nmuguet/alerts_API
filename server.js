const { app } = require('./app')
const config = require('./config/default.json')
const configEnv = require('./config/custom-environment-variables.json')



const port = process.env.PORT || config.server.port

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port)