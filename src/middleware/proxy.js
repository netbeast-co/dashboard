
var express = require('express')
var httpProxy = require('http-proxy')

var Activity = require('../models/activity')
var broker = require('../helpers/broker')

var router = module.exports = express.Router()

var proxy = httpProxy.createProxyServer({ ws: true })

proxy.on('error', function (err) {
  broker.error(err.message, 'Proxy error')
})

router.use('/i/:name?', function (req, res, next) {
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') === undefined) return next()

  var aux = req.get('referer').split('/')
  aux = aux[aux.indexOf('i') + 1]
  // removes ?no_cache
  req.referer = aux.substring(aux.indexOf('?'), 0) || aux
  return next()
})

router.use('/i/:name?', function (req, res) {
  var app, reqUrl, proxyUrl

  // This block returns an app object
  // with the port where it is running
  app = Activity.get(req.params.name) ||
  Activity.get(req.referer)

  if (!app) return res.status(404).send('App not running')

  // Here app is running
  // In case the path is /i/:name
  // instead of /i/:name/ you need this block
  reqUrl = req.originalUrl.replace('/i/', '/')
  reqUrl = reqUrl.replace('/' + app.name, '')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  proxyUrl = req.protocol + '://localhost:' + app.port
  req.url = reqUrl

  // This block prevents iframe caching
  proxy.web(req, res, { target: proxyUrl })
})
