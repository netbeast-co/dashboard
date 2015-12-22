var path = require('path')
var multer = require('multer')

var config = require('../../config')
var error = require('../util/invalid-format')
var App = require('../models/app')
var broker = require('../helpers/broker')

module.exports.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return new Date().getTime() + '-' + filename
  },
  onFileUploadStart: function (file, req, res) {
    var fname = file.name
    var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
    if (ext !== 'tar.gz' && ext !== 'tgz.') {
      res.status(403).send('Invalid Package. Must be a tar.gz')
      return false
    }
  },
  onFileUploadComplete: function (file, req, res) {
    req.uploadedFile = file
  }
})

module.exports.process = function (req, res, next) {
  if (!req.uploadedFile) return next()

  var tarball = path.join(config.tmpDir, req.uploadedFile.name)
  App.install(tarball, function (err, appJson) {
    if (err) return next(err)
    broker.success(appJson.name + ' installed')
    res.status(204).end()
  })
}

module.exports.git = function (req, res, next) {
  if (!req.body.url) return next()

  App.install(req.body.url, function (err, appJson) {
    if (err) return next(err)
    broker.success(appJson.name + ' installed')
    res.status(204).end()
  })
}
