const _ = require('lodash');

exports.capitalizeFirstLetters = string => _.startCase(_.toLower(string));

exports.capitalizeFirstLetter = string => _.capitalize(string);
