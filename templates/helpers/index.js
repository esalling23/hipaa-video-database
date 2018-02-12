var _ = require('underscore');
var hbs = require('handlebars');

module.exports = function() {

    var _helpers = {};

    /**
     * Local HBS Helpers
     * ===================
     */

   _helpers.idIfy = function(str) {
      var newStr = str.replace(/[^\w\s]|_/g, "")
                  .replace(/\s+/g, "_");
      return newStr;
   };

    return _helpers;


};
