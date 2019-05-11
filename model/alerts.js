const mongoose = require('mongoose');
const tcomb = require('tcomb')


//Still usefull ?
const ALERT = tcomb.struct({
    type: tcomb.enums({ 'weather': 'weather', 'sea': 'sea', 'transport': 'transport' }, 'type'),
    label: tcomb.String,
    status: tcomb.enums({ 'warning': 'warning', 'threat': 'threat', 'danger': 'danger', 'risk': 'risk' }, 'status'),
    from: tcomb.String,
    to: tcomb.String
}, { strict: true })


const alerts = mongoose.model('Alert', {
    type: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
})

//For test
const alertTest = {
    type: 'weather',
    label: "alerte de test",
    status: 'risk',
    from: 'now',
    to: 'monday'
}

//Not asked, just for test
const getAll = async () => {
    try {
        return await alerts.find()
    } catch (exc) { console.log(exc) }
}

//Return a single alert by Id
const getById = async (id) => {
    try {   
        return await alerts.findById(id)
    } catch (exc) { console.log(exc) }
}

//Return alert(s) by criteria
// Doc mongoDB : The $in operator selects the documents where the value of a field equals any value in the specified array
const getByCriteria = async (criterias) => {
    try {
        return await alerts.find({ status: { "$in": criterias } })
    } catch (exc) { console.log(exc) }
}

//Add a alert
const add = async (alert) => {
    if (await validateAlert(alert)) {
        console.log("validated")
        const newAlert = new alerts(alert)
        await newAlert.save(function (err) {
            if (err) {
                console.log('Alert NOT added')
                return handleError(err);
            }
            console.log('Alert added')
        });
        return newAlert
    } else {
        throw new Error('Invalid input')
    }
}


//Update a alerts
const update = async (id, newProperties) => {
    if (await validateAlert(newProperties)) {
        console.log("validated")
        try {
            const UpdatedAlert = await alerts.findByIdAndUpdate(id, newProperties, { new: true })
            return UpdatedAlert
        } catch (exc) {
            console.log('Alert NOT updated')
            console.log(exc)
            throw new Error('Invalid input')
        }
    } else {
        console.log("NOT validated")
        throw new Error('Invalid input')
    }
}

const remove = async (id) => {
    try {
       return removedAlert = await alerts.findByIdAndRemove(id)
    } catch (exc) { console.log(exc) }
}


//To check if an alert format is valid
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
exports.getById = getById
exports.getByCriteria = getByCriteria
exports.update = update
exports.remove = remove
