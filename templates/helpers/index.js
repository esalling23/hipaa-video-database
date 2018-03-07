var _ = require('underscore');
var hbs = require('handlebars');

module.exports = function() {

    var _helpers = {};

    /**
     * Local HBS Helpers
     * ===================
     */

     _helpers.combine = function(str) {

        if(str === undefined)
            return;

    	var s = str.replace(/\s+/g, '-').replace('/', '-');
    	return s.toLowerCase();
    };
    _helpers.noSpace = function(str) {

       if(str === undefined)
           return;

     var s = str.replace(/-/g, '');
     return s.toLowerCase();
    };

    _helpers.camelCase = function(str) {

       if(str === undefined)
           return;

      var newString;
      for (var x = 0; x < str.split("-").length; x++) {
        console.log(x);
        // console.log(str.split("-")[x].charAt(0).toUpperCase() + str.split("-")[x].slice(1));
        if (x > 0) {
          newString += str.split("-")[x].charAt(0).toUpperCase() + str.split("-")[x].slice(1);
        } else {
          newString = str.split("-")[x];
        }
        console.log(newString);
      }

      console.log(newString);

       var s = newString.replace(/-/g, '').replace('/', '-');
       return s;
   };

     _helpers.dateFormat = function(str) {

       return str;
     };

     _helpers.idIfy = function(str) {
        var newStr = str.replace(/[^\w\s]|_/g, "")
                    .replace(/\s+/g, "_");
        return newStr;
     };


    return _helpers;


};
