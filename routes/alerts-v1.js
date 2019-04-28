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

/* Find alert by ID */
router.get('/', function (req, res, next) {
  res
    .status(200)
    .json({ message: 'Juste pour tester. Si ça s\'affiche, la base fonctionne' })
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