// const _ = require('underscore')
// const hbs = require('handlebars')

module.exports = function () {
  const _helpers = {}

  /**
   * Local HBS Helpers
   * ===================
   */

  _helpers.ifeqor = (a, b, c, options) => {
    console.log(a, b)
    console.log(a, c)
    if (a === b || a === c) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }

  _helpers.combine = (str) => {
    if (str === undefined) return

    const s = str.replace(/\s+/g, '-').replace('/', '-')
    return s.toLowerCase()
  }
  _helpers.noSpace = (str) => {
    if (str === undefined) return

    const s = str.replace(/-/g, '')
    return s.toLowerCase()
  }

  _helpers.camelCase = (str) => {
    if (str === undefined) return

    let newString
    for (let x = 0; x < str.split('-').length; x++) {
      console.log(x)
      // console.log(str.split('-')[x].charAt(0).toUpperCase() + str.split('-')[x].slice(1))
      if (x > 0) {
        newString += str.split('-')[x].charAt(0).toUpperCase() + str.split('-')[x].slice(1)
      } else {
        newString = str.split('-')[x]
      }
      console.log(newString)
    }

    console.log(newString)

    const s = newString.replace(/-/g, '').replace('/', '-')
    return s
  }

  _helpers.dateFormat = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec']
    if (!date) return
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
  }

  _helpers.add = (num1, num2) => {
    return num1 + num2
  }

  _helpers.idIfy = (str) => {
    const newStr = str.replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '_')
    return newStr
  }

  return _helpers
}
