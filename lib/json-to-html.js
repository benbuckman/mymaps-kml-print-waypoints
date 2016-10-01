'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const debug = require('debug')('kml:jsonToHtml');
const ejs = require('ejs');

module.exports = function jsonToHtml(kmlData, htmlPath, templatePath, imagesDir) {
  kmlData = kmlData.kml.Document[0];

  let iconMap = {};
  kmlData.Style.forEach(function(icon) {
    const iconId = '#' + icon.$.id;
    if (!icon.IconStyle) return; // lines etc

    let iconUrl = icon.IconStyle[0].Icon[0].href[0];
    iconUrl = iconUrl.replace(/images\//, '');
    iconUrl = path.resolve(imagesDir, iconUrl);
    debug('iconUrl', iconUrl);

    iconMap[iconId] = iconUrl;

    if (/-normal$/.test(iconId)) {
      const plainIconId = iconId.replace(/-normal$/, '');
      if (!iconMap[plainIconId]) {
        iconMap[plainIconId] = iconUrl;
      }
    }
  });
  debug('Built icon map: %j', iconMap);

  kmlData.Folder.forEach(function(folder) {
    folder.Placemark.forEach(function(place) {

      // from earlier iteration before built-in "Sequence of numbers" feature,
      // this would allow a number to be manually added to the name.
      /*
      try {
        const split = place.name[0].match(/^\((\d+)\) (.*)/);
        debug('split place name %s to %j', place.name[0], split);
        if (split && split[1] && split[2]) {
          place.number = Number(split[1]);
          place.name = split[2];
        }
      } catch(err) {
        console.error('failed to split', place, err);
        throw err;
      }
      */

      if (place.description && place.description[0]) {
        place.description = place.description[0].replace(/(<br>){2,}/g, '<br>');
      }

    });

    // (See note on numbers above)
    /*
    folder.Placemark.sort(function(p1, p2) {
      if (p1 && p2 && p1.number > p2.number) return 1;
      if (p1 && p2 && p1.number < p2.number) return -1;
      return 0;
    });
    */
  });


  const template = fs.readFileSync(templatePath, {  encoding: 'utf8' });
  debug('Template content:', template);

  const cssDir = path.resolve(__dirname, '../view');

  const html = ejs.render(template, { kmlData, iconMap, cssDir });
  debug('html:', html);

  fs.writeFileSync(htmlPath, html, {encoding: 'utf8'});
  console.log('Wrote to', htmlPath);

  child_process.exec(`open '${htmlPath}'`);
};

