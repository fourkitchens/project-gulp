/* globals require */

function initEnv(projectConfig) {
  let defaults = _.get(projectConfig, 'env.default', {});

  _.forIn(projectConfig.env, function (vars, env) {
    let envVars = _.defaultsDeep(projectConfig.env[env], defaults);

    _.forIn(envVars, function (value, key) {
      process.env['ENV_' + env.toUpperCase() + '_' + key.toUpperCase()] = value;
    });
  });
}

module.exports = function(gulp) {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');
  const _ = require('lodash');
  let projectDir = path.join(__dirname, '../');
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

  initEnv(projectConfig);

  // Include tasks.
  require('./gulp-tasks/gulp-run.js')(gulp, projectConfig);

};
