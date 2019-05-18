const express = require('express')
const router = express.Router()

let alertsModel = undefined
const ID_LENGTH = 24

/* Control usermodel initialisation */
router.use((req, res, next) => {
    /* istanbul ignore if */
    if (!alertsModel) {
        res
            .status(500)
            .json({ message: 'model not initialised' })
    }
    next()
})

/* Display all alerts (not asked, test)*/
router.get('/all', async function (req, res) {
    res
        .status(200)
        .json({
            alertes: await alertsModel.getAll()
        })
})

/* Find alert by different criterias*/ //FINI (model+route+test)
// Request example : search?status=warning,risk
router.get('/search', async function (req, res) {
    if (req.query.status) {
        const criterias = req.query.status.split(',')
        console.log("Searching ")
        console.log(criterias)
        const alertFound = await alertsModel.getByCriteria(criterias)
        if (alertFound) {
            console.log("search done")
            res
                .status(200)
                .json(alertFound)
        }
    } else {
        res
            .status(400)
            .json({
                code: 0,
                type: "error",
                message: 'Invalid tag value',
            });
    }
})

/* Find alert by ID */ //FINI (model+route+test)
router.get('/:id', async function (req, res) {
    const id = req.params.id
    console.log("Searching " + id)
    if (id && id.length === ID_LENGTH) {
        const alertFound = await alertsModel.getById(id)
        if (alertFound) {
            res
                .status(200)
                .json(alertFound)
        } else {
            res
                .status(404)
                .json({
                    code: 0,
                    type: "error",
                    message: 'Alert not found',
                });
        }
    } else {
        res
            .status(400)
            .json({
                code: 0,
                type: "error",
                message: 'Invalid ID supplied',
            });
    }

})

/* Create a new alert*/ //FINI (model+route+test)
router.post('/', async function (req, res) {
    const newAlert = req.body
    try {
        const alert = await alertsModel.add(newAlert)
        res
            .status(200)
            .send(alert)
    } catch (exc) {
        res
            .status(405)
            .json({
                code: 0,
                type: "error",
                message: exc.message
            })
    }
})

/* Updates an alert*/ //FINI (model+route+test)
router.put('/:id', async function (req, res) {
    const newAlert = req.body
    const id = req.params.id
    try {
        const alert = await alertsModel.update(id, newAlert)
        if (alert) {
            res
                .status(200)
                .json(alert)
        }
        else {
            res
                .status(405)
                .json({
                    code: 0,
                    type: "error",
                    message: "Invalid input"
                })
        }
    } catch (exc) {
        res
            .status(405)
            .json({
                code: 0,
                type: "error",
                message: exc.message
            })
    }
})

/* Deletes an alert by ID */ //FINI (model+route+test)
router.delete('/:id', async function (req, res) {
    const id = req.params.id
    console.log("removing " + id)
    if (id && id.length === ID_LENGTH) {
        try {
            const alert = await alertsModel.remove(id)
            if (alert) {
                res
                    .status(200)
                    .end()
            }
            else {
                res
                    .status(404)
                    .end()
            }
        }
        catch (error) {
            res
                .status(404)
                .end()
        }
    } else {
        res
            .status(400)
            .end()
    }

})


/** return a closure to initialize model */
module.exports = (model) => {
    alertsModel = model
    return router
}