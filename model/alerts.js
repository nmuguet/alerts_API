const MongoClient = require('mongodb').MongoClient
const tcomb = require('tcomb')

const ALERT = tcomb.struct({
    type: tcomb.enums.of('weather sea transport', 'type'),
    label: tcomb.String,
    status: tcomb.enums.of('warning threat danger risk', 'type'),
    from: tcomb.String,
    to: tcomb.String
}, { strict: true })

let alerts

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
    if (err) { throw err }
    let database = client.db("alertsDB");
    alerts = database.collection("alerts");
});

let alertTest = { label: "alerte de test" }

//Si on charge la page trop vite après avoir démarré
//le find se lance alors que alert est encore undefined

const getAll = () => {
    return alerts.find().toArray()
}

const get = (id) => {
    return alerts.find({id : id}).toArray()
}

const add = (alert) => {
    if (validateAlert(alert)) {
        alerts.insertOne(alertTest), function (err, res) {
            if (err) { throw err }
        }
    } else {
        throw new Error('alert.not.valid')
    }
}

function validateAlert(alert) {
    let result = false
    /* istanbul ignore else */
    if (alert) {
        try {
            const tcombUser = ALERT(alert)
            result = true
        } catch (exc) {
            result = false
        }
    }
    return result
}


exports.getAll = getAll
exports.add = add
exports.get = get
