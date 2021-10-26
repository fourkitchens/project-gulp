/* globals require, process */

(function () {

  'use strict';

  const fs = require('fs');
  const path = require('path');

  module.exports = function (gulp, projectConfig, projectDir) {

    gulp.task('drush-aliases', function () {
      console.log('Setting up Drush aliases...');

      let projectDrush = path.join(projectDir, 'drush');
      let homeDrush = path.join(process.env.HOME, '.drush');

      fs.readdirSync(projectDrush)
        .filter((child) => {
          return child.indexOf('.aliases.drushrc.php') > 0;
        })
        .forEach((child) => {
          if (!fs.existsSync(homeDrush)) {
            fs.mkdirSync(homeDrush);
          }

          if (!fs.existsSync(path.join(homeDrush, child))) {
            console.log('Adding Drush alias: ' + child);
            fs.symlinkSync(path.join(projectDrush, child), path.join(homeDrush, child));
          }
        });
    }, {
      options: {}
    });

  };
})();
