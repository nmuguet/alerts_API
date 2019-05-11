const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose');
const config = require('./config/default.json')


const alertsRouter = require('./routes/alerts-v1')
const alertsModel = require('./model/alerts')

const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

// Connect to Mongo BDD
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://' + config.dbConfig.host + ':' + config.dbConfig.port+'/'+ config.dbConfig.bddName, {
	useNewUrlParser: true
})


const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))

// On injecte le model dans les routers. Ceci permet de supprimer la dépendance
// directe entre les routers et le modele
app.use('/alerts', alertsRouter(alertsModel))

// For unit tests
exports.app = app