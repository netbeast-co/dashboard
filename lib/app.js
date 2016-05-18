// Netbeast App model
// by jesusdario
// CTO @ NetBeast

var path = require('path')

var fs = require('fs-extra')

var self
/* Application constructor */
function App (name) {
  self = this
  self.name = name
}

const APP_BUNDLE = __dirname + '/../bin/bundles/base-app'
const PLUGIN_BUNDLE = __dirname + '/../bin/bundles/base-plugin'
const CURRENT_DIR = process.cwd()

/* Non-static methods and properties */
App.prototype.constructor = App

App.create = function (appName, options) {
  _quitIfExists(appName)

  var destination = path.join(CURRENT_DIR, appName)
  var destJson = path.join(destination, 'package.json')

  var bundle = (options.plugin) ? PLUGIN_BUNDLE : APP_BUNDLE

  console.log("> Creating app '%s'...", appName)
  fs.copySync(bundle, destination)
  var pkgJson = fs.readJsonSync(destJson)
  pkgJson.name = appName
  fs.writeJsonSync(destJson, pkgJson)
  console.log('> The extraction has ended!')
  console.log('> You may want to install app dependences. Type:\n')
  console.log('\t cd ./%s;', appName)
  console.log('\t npm install;\n')
}

function _quitIfExists (file) {
  if (fs.existsSync(file)) {
    console.log("> Path '%s' already exists", file)
    process.exit(0)
  }
}

function _quitIfNotExists (file) {
  if (!fs.existsSync(file)) {
    console.log("> Path '%s' does not exists", file)
    process.exit(0)
  }
}

module.exports = App
