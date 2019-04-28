const uuidv1 = require('uuid/v1')
var util = require('util')

const MongoClient = require('mongodb').MongoClient

let alerts

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
    if (err) { throw err }
    database = client.db("alertsDB");
    alerts = database.collection("alerts");
});

let alert = { label: "alerte de test" }

const  getAll = () => {
    alerts.find(), function (err, res) {
        if (err) {
            throw err
        }
        else {
           return res
        }
    }
}

const add = () => {
    alerts.insertOne(alert), function (err, res) {
        if (err) {
            console.log("insertion FAIL")
            throw err
        }
        else {
            console.log("insertion DONE")
        }
    }
}

// Toutes les methodes pour recuperer les alertes de la database

exports.getAll = getAll
exports.add = add
