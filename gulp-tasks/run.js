/* globals require, process, __dirname */

(function () {

  'use strict';

  const options = require('minimist')(process.argv.slice(2), {
    alias: {
      t: 'task',
      y: 'yes',
      h: 'help'
    }
  });
  const fs = require('fs');
  const path = require('path');
  const execSync = require('child_process').execSync;
  const yaml = require('js-yaml');
  const prompt = require('gulp-prompt');
  const tap = require('gulp-tap');
  const _ = require('lodash');

  module.exports = function (gulp, projectConfig, projectDir) {

    function taskHelp() {
      let output = 'Syntax: gulp run -t task_name \n';
      output += 'Available run tasks: \n';

      _.forIn(projectConfig.run, function(task, name) {
        if (task.hasOwnProperty('description')) {
          output += name + ': ' + task.description + '\n';
        }
      });

      return output;
    }

    function executeTaskCommand(task) {
      console.log('Running "' + task + '" commands.');

      try {
        projectConfig.run[task].commands.forEach((command) => {
          if (command.indexOf('echo ') < 0) {
            console.log('Command: ' + command);
          }

          execSync(command, {stdio: 'inherit'});
        });
      } catch (err) {
        console.log(err.message);
      }
    }

    gulp.task('run', 'Project run tasks.', function () {
      // Help option set or task option set without a task.
      if (options.hasOwnProperty('h')
        || !options.hasOwnProperty('t')
        || (options.hasOwnProperty('t') && !options.t.length)) {
        console.log(taskHelp());
        return;
      }

      // Run the task commands.
      if (options.hasOwnProperty('t') && options.t.length > 0) {
        let task = options.t;

        if (_.hasIn(projectConfig, 'run.' + task)) {
          let taskConfig = projectConfig['run'][task];

          // If task config has a confirm property and it is not false and the
          // --yes option has not been set, prompt the user with the
          // confirmation message.
          if (taskConfig.hasOwnProperty('confirm')
            && taskConfig.confirm
            && !options.hasOwnProperty('y')) {
            return gulp.src('')
              .pipe(prompt.prompt({
                type: 'confirm',
                name: 'task',
                message: taskConfig.confirm,
                default: false
              }, function (res) {
                if (res.task) {
                  executeTaskCommand(task);
                }
              }));
          }
          // No prompt, just execute the task commands.
          else {
            executeTaskCommand(task);
          }
        }
        else {
          console.log('Task "' + task + '" is not defined in project.yml.');
          console.log(taskHelp());
        }
      }
    }, {
      options: {
        task: 'The name of the project task to run.',
        yes: 'Automatically confirm all prompts.',
        help: 'Print available run tasks.'
      }
    });

  };
})();
