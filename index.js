/* globals require */

module.exports = function(gulp, modules) {

  'use strict';

  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');
  const _ = require('lodash');
  let projectDir = path.join(__dirname, '../../');
  let projectConfig = {};

  // Load config from project.yml.
  try {
    projectConfig = yaml.safeLoad(fs.readFileSync(path.join(projectDir, 'project.yml'), 'utf8'));
  } catch (e) {}

  // Get local project config from local.project.yml and merge.
  try {
    let localConfig = yaml.safeLoad(fs.readFileSync(path.join(projectDir, 'local.project.yml'), 'utf8'));
    projectConfig = _.defaultsDeep(localConfig, projectConfig);
  } catch (e) {}

  /**
   * Sets environment variables defined in project.yml.
   *
   * @param {Object} projectConfig - Project configuration defined in
   *   project.yml.
   */
  function initEnvVars(projectConfig) {
    let defaults = _.get(projectConfig, 'env.default', {});

    _.forIn(projectConfig.env, function (vars, env) {
      let envVars = _.defaultsDeep(projectConfig.env[env], defaults);

      _.forIn(envVars, function (value, key) {
        process.env['ENV_' + env.toUpperCase() + '_' + key.toUpperCase()] = value;
      });
    });
  }

  // Set environment variables.
  initEnvVars(projectConfig);

  // Get available task modules.
  let modulesAvailable = fs.readdirSync(path.join(__dirname, 'gulp-tasks'));
  let lintModulesAvailable = [];

  // Loop over modules and include them.
  modulesAvailable.forEach( function (filename) {
    let moduleName = path.basename(filename, '.js')

    // If modules array is empty or if this module is specified, include it.
    if (!modules.length || modules.indexOf(moduleName) >= 0) {
      // Include the task module:
      require('./gulp-tasks/' + filename)(gulp, projectConfig, projectDir);

      if (['eslint', 'phpcs'].indexOf(moduleName) >= 0) {
        lintModulesAvailable.push(moduleName);
      }
    }
  });

  /**
   * Run all linting tests.
   */
  gulp.task('lint', 'Run all coding standard and style checking tools.', lintModulesAvailable);

};
