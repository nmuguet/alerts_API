const express = require('express')
const router = express.Router()

let alertsModel = undefined

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
router.get('/', async function  (req, res, next) {
  res
    .status(200)
    .json({
      alertes : await alertsModel.getAll()
    })
})

// Just for test
router.get('/add', async function (req, res, next) {
  await alertsModel.add()
  res
    .status(200)
    .json({

    })
})

/* Find alert by ID */
router.get('/:id', function (req, res, next) {
  res
    .status(200)
    .json({ message: 'GET on alert ' + req.params.id })
})


/** return a closure to initialize model */
module.exports = (model) => {
  alertsModel = model
  return router
}