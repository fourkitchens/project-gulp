/* globals require */

module.exports = function(gulp) {

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

  // Include run task.
  require('./gulp-tasks/run.js')(gulp, projectConfig);
  // Include drush-aliases task.
  require('./gulp-tasks/drush-aliases.js')(gulp, projectDir);
  // Include phpcs task.
  require('./gulp-tasks/phpcs.js')(gulp);

};
