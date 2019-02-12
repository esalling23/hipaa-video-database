// Return server object
const serverStart = function () {
  /* Global accessor for underscore  */
  const _ = require('underscore')

  /* Global accessor for logger  */
  // const logger = require('winston')

  const express = require('express')
  const app = express()

  // support json encoded bodies
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }))

  // Enable view template compilation caching
  app.enable('view cache')

  return app
}

// Any custom app initialization logic should go here
const appStart = function (app) {
  const keystone = require('keystone')
}

module.exports = function (frameworkDir, shared) {
  const path = require('path')
  // Add main dependencies and EL web framework dependencies if not mounted with EL framework repo
  if (!shared) {
    require('app-module-path').addPath(path.join(__dirname, '/node_modules'))
    require('app-module-path').addPath(frameworkDir + '/node_modules')
  }

  // Obtain app root path and set as keystone's module root
  const appRootPath = require('app-root-path').path
  const keystoneInst = require('keystone')
  keystoneInst.set('module root', appRootPath)
  keystoneInst.set('cookie secret', '(your secret here)')
  keystoneInst.set('wysiwyg additional buttons', 'blockquote')

  return {
    keystone: keystoneInst,
    server: serverStart,
    start: appStart
  }
}
