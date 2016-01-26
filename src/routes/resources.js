// require sistema

// modules
var express = require('express')

// librerias propias
var	Resource = require('../models/resource.js')
var ApiError = require('../util/api-error')

var	router = express.Router()

router.route('/resources')

.get(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err) return next(err)

    res.json(resources)
  })
})

.post(function (req, res, next) {
  Resource.findOne(req.body, function (err, resource) {
    if (err && err.statusCode !== 404) return next(err)

    if (resource) {
      return new ApiError(500, 'This action exists!')
    }

    Resource.create(req.body, function (err, item) {
      if (err) return next(err)
      return res.status(204).end()
    })
  })
})

.patch(function (req, res, next) {
  Resource.findOne(req.query, function (err, resource) {
    if (err) return next(err)

    Resource.update(req.query, req.body, function (err) {
      if (err) return next(err)
      return res.status(204).end()
    })
  })
})

.delete(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err) return next(err)

    resources.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return next(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
