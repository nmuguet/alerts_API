const { app } = require('./app')
const config = require('config')


const port = process.env.PORT || config.get('server.port')

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port)