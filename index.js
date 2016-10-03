#! /usr/bin/env node

'use strict';

const path = require('path');

const debug = require('debug')('kml');

const kmlToJson = require('./lib/kml-to-json');
const jsonToHtml = require('./lib/json-to-html');

const argv = require('minimist')(process.argv);

function printUsage() {
  console.log(`
  Print waypoints from Google My Maps KML/KMZ file
   
  Usage:
    mymaps-kml-print-waypoints --kml=[path to input .kml file] --html=[path to output html file]
     
    Optional:
      --images=[path to \`images\` dir, extracted from \`.kmz\` file, if using]
      --template=[path] to override template file

      Use \`DEBUG=kml* node ...\` for verbose output.
  `);
}

const kmlPath = argv.kml ? path.resolve(process.cwd(), argv.kml) : null;
const htmlPath = argv.html ? path.resolve(process.cwd(), argv.html) : null;
const templatePath = argv.template ? path.resolve(process.cwd(), argv.template)
  : path.resolve(__dirname, 'view', 'waypoints.html.ejs');
const imagesDir = argv.images ? path.resolve(process.cwd(), argv.images) : '';

debug('kml: %s to html: %s with template: %s', kmlPath, htmlPath, templatePath);

if (argv.help) {
  printUsage();
  process.exit();
}

if (!kmlPath || !htmlPath) {
  console.error('Missing `--kml` or `--html` file path\n');
  printUsage();
  process.exit(1);
}

// xml parser is async
kmlToJson(kmlPath, (err, json) => {
  if (err) throw err;

  // generates and writes HTML synchronously
  jsonToHtml(json, htmlPath, templatePath, imagesDir);
  process.exit();
});
