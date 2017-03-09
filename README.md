# project-gulp

Contains Gulp tasks useful for Four Kitchens projects.

To include in your project:

```
npm install fourkitchens/project-gulp --save-dev
```

Then in a `gulpfile.js` file in your project root:

```
(function () {
  'use strict';
  let gulp = require('gulp-help')(require('gulp'));
  require('project-gulp')(gulp, []);
})();
```

If the second argument in `require('project-gulp')(gulp, [])` remains an empty array, all project-gulp tasks will be loaded. If you want to limit the tasks that get loaded, include only the task names that you want loaded in that array:

```
require('project-gulp')(gulp, ['phpcs', 'eslint']);
```

## Available tasks

**phpcs**

Options:

Runs phpcs tests on your codebase.

`--path` or `-p`: The path in which to check coding standards

`--exit` or `-e`: Exit with an error code if phpcs finds errors in a file

`--install` or `-i`: Installs phpcs and other dependencies using Composer prior to testing

Syntax:
```
gulp phpcs
gulp phpcs --path path/to/file
gulp phpcs --exit
gulp phpcs --install
```

To ignore paths, add them to a `.phpcsignore` file in your project root.

To override/extend the default ruleset, add a `ruleset.xml` file to your project root.

**eslint**

Runs eslint tests on your codebase.

Options:

`--path` or `-p`: The path in which to check coding standards

Syntax:
```
gulp eslint
gulp eslint -path path/to/file
```

To ignore paths, add them to a `.eslintignore` file in your project route.

To override/extend the default configuration, add a `.eslintrc` file to your project root.

**run**

Executes project run tasks defined in `project.yml` file in your project root.

See `example.project.yml`.

Options:

`--task` or `-t`: The name of the project task to run

`--yes` or `-y`: Automatically confirm all prompts

`--help` or `-h`: Print available run tasks

Syntax:
```
gulp run --task taskname
gulp run --yes --task taskname
gulp run --help
```

**drush-aliases**

Attempts to symlink any drush alias files in a `drush` directory in your project root to a `.drush` directory in your home folder.

Syntax:
```
gulp drush-aliases
```

## Helper tasks

**lint**

Runs all available linting tasks (e.g. phpcs and eslint) enabled for your project.

Syntax:
```
gulp lint
```
