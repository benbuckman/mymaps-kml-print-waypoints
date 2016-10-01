'use strict';

const fs = require('fs');

const debug = require('debug')('kml:kml2json');
const xml2js = require('xml2js');

module.exports = function kmlToJson(kmlPath, cb) {
  debug('reading KML from', kmlPath);

  const parser = new xml2js.Parser();
  const kmlContent = fs.readFileSync(kmlPath);

  parser.parseString(kmlContent, function(err, json) {
    if (err) {
      debug('parse error', err);
      return cb(err);
    }

    debug('parsed JSON: %j', json);

    cb(null, json);
  });
};
