const MongoClient = require('mongodb').MongoClient
const tcomb = require('tcomb')
const config = require('config')
const { ObjectId } = require('mongodb')

const ALERT = tcomb.struct({
    type: tcomb.enums({ 'weather': 'weather', 'sea': 'sea', 'transport': 'transport' }, 'type'),
    label: tcomb.String,
    status: tcomb.enums({ 'warning': 'warning', 'threat': 'threat', 'danger': 'danger', 'risk': 'risk' }, 'status'),
    from: tcomb.String,
    to: tcomb.String
}, { strict: true })

let alerts
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, client) {
    if (err) { throw err }
    let database = client.db("alertsDB");
    alerts = database.collection("alerts");
});

let alertTest = {
    type: 'weather',
    label: "alerte de test",
    status: 'risk',
    from: 'now',
    to: 'monday'
}

//Si on charge la page trop vite après avoir démarré
//le find se lance alors que alert est encore undefined

const getAll = () => {
    return alerts.find().toArray()
}

const get = async(id) => {
    const obj_id = ObjectId(id)
    return await alerts.find({ _id: obj_id }).toArray()
}

const add = async(alert) => {
    if (await validateAlert(alert)) {
        console.log('We added :')
        console.log(alert)
        alerts.insertOne(alert),
            function(err, res) {
                if (err) { throw err }
            }
    } else {
        console.log('Error with :')
        console.log(alert)
        throw new Error('alert.not.valid')
    }
}

function validateAlert(alert) {
    let result = false
        /* istanbul ignore else */
    try {
        const tcombUser = ALERT(alert)
        result = true
    } catch (exc) {
        result = false
    }

    return result
}


exports.getAll = getAll
exports.add = add
exports.get = get