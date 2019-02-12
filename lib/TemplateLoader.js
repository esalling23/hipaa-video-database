'use strict'

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Template loader.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

// const fs = require('fs')
const handlebars = require('keystone').get('handlebars')
const rootDir = require('app-root-path')

class TemplateLoader {
  Load (filePath, data, callback) {
    if (!data) data = {}

    // logger.info('TemplateLoader', 'Loading ' + rootDir + '/templates/' + filePath + '.hbs')

    handlebars
      .render(rootDir + '/templates/' + filePath + '.hbs', data)
      .then(function (res) {
        callback(res)
      })
      .catch(function (err) {
        const opt = { error: err, file: rootDir + '/templates/' + filePath + '.hbs' }
        console.error('TemplateLoader ERROR:', opt)
      })
  }
}

module.exports = TemplateLoader
