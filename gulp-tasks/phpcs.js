/* globals require, process */

(function () {

  'use strict';

  const options = require('minimist')(process.argv.slice(2), {
    alias: {
      p: 'path',
      e: 'exit',
      i: 'install'
    },
  });
  const fs = require('fs-extra');
  const path = require('path');
  const tap = require('gulp-tap');
  const execSync = require('sync-exec');

  module.exports = function (gulp, projectConfig, projectDir) {

    /**
     * Run phpcs.
     */
    gulp.task('phpcs', 'Check PHP files for coding standards issues.', function () {
      // If the install option is set, install phpcs using Composer.
      if (!fs.existsSync(path.join(__dirname, '../vendor/bin/phpcs'))) {
        if (options.hasOwnProperty('install')) {
          execSync('gulp install-phpcs', {stdio: 'inherit'});
        }
        else {
          console.log('The phpcs test couldn\'t find the dependencies it needs to run. Make sure you have Composer installed on your machine and rerun this command with the install option:\ngulp phpcs -i');
          return;
        }
      }
      else {
        if (options.hasOwnProperty('install')) {
          console.log('phpcs is already installed.');
        }
      }

      console.log('Running phpcs...');
      // Source file defaults to a pattern.
      var extensions = '{php,module,inc,install,test,profile,theme}';
      var sourcePatterns = [
        '**/*.' + extensions,
        '*.' + extensions
      ];

      var excludePatterns = [];

      // Get exclude patterns from a .phpcsignore file in the project root.
      if (fs.existsSync('./.phpcsignore')) {
        var contents = fs.readFileSync('./.phpcsignore', 'utf8');

        contents.split('\n').filter(Boolean).forEach(function (item) {
          excludePatterns.push('!' + item);
        });
      }

      // If path is provided, override.
      if (options.hasOwnProperty('path') && options.path.length > 0) {
        sourcePatterns = [
          options.path + '/*.' + extensions,
          options.path + '/**/*.' + extensions
        ];
      }

      // Merge sourcePatterns with excludePatterns.
      var patterns = sourcePatterns.concat(excludePatterns);

      return gulp.src(patterns)
        .pipe(tap(function (file) {
          var ruleset = path.join(__dirname, '../ruleset.xml');

          // Use project ruleset if provided.
          if (fs.existsSync('./ruleset.xml')) {
            ruleset = './ruleset.xml';
          }

          execSync(path.join(__dirname, '/../vendor/bin/phpcs') + ' --config-set installed_paths ' + path.join(__dirname, '/../vendor/drupal/coder/coder_sniffer'));
          var report = execSync(__dirname + '/../vendor/bin/phpcs --standard="' + ruleset + '" ' + file.path);

          if (report.stdout.length > 0) {
            // Log report, and remove silly Code Sniffer 2.0 ad.
            /* eslint-disable */
            console.log(report.stdout.split('UPGRADE TO PHP_CODESNIFFER 2.0 TO FIX ERRORS AUTOMATICALLY')[0]);
            /* eslint-enable */
          }

          if (report.status !== 0 && options.hasOwnProperty('exit')) {
            // Exit with error code.
            /* eslint-disable */
            process.exit(report.status);
            /* eslint-enable */
          }

        }));
    }, {
      options: {
        path: 'The path in which to check coding standards.',
        exit: 'Exit with an error code if phpcs finds errors.',
        install: "Installs phpcs and other dependencies using Composer prior to testing."
      }
    });

    /**
     * Install phpcs and dependencies using Composer.
     */
    gulp.task('install-phpcs', 'Install phpcs and dependencies using Composer.', function () {
      // Run composer install inside this module.
      execSync('composer install -d ' + path.join(__dirname, '../'), {stdio: 'inherit'});

      // The composer install will download Drupal core, which we don't actually
      // need. Remove it.
      if (fs.existsSync(path.join(__dirname, '/../vendor/drupal/core'))) {
        fs.removeSync(path.join(__dirname, '/../vendor/drupal/core'));
      }
    });

  };
})();
