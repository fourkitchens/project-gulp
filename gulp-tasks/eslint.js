/* globals require, process */

(function () {

  'use strict';

  const options = require('minimist')(process.argv.slice(2), {
    alias: {
      p: 'path'
    },
  });
  const eslint = require('gulp-eslint');

  module.exports = function (gulp, projectConfig, projectDir) {

    /**
     * Run eslint.
     */
    gulp.task('eslint', 'Check JavaScript files for coding standards issues.', function () {
      let patterns = [
        '*.js',
        '**/*.js'
      ];

      // If path is provided, override.
      if (options.hasOwnProperty('path') && options.path.length > 0) {
        patterns = [
          options.path + '/*.js',
          options.path + '/**/*.js'
        ];
      }

      return gulp.src(patterns)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
    }, {
      options: {
        path: 'The path in which to check coding standards.'
      }
    });

  };
})();
