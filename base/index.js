'use strict';
var path = require('path');
var url = require('url');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var npmName = require('npm-name');
var superb = require('superb');
var _ = require('lodash');
var _s = require('underscore.string');

var extractGeneratorName = function (appname) {
  var match = appname.match(/^generator-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }

  return appname;
};

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('flat', {
      type: Boolean,
      required: false,
      defaults: false,
      description: 'When specified, generators will be created at the top level of the project.'
    });
  },

  initializing: function () {
    this.config.set('structure', this.options.flat ? 'flat' : 'nested');
    this.generatorsPrefix = this.options.flat ? '' : 'generators/';
    this.appGeneratorDir = this.options.flat ? 'app' : 'generators';
    // TODO enforce folder name
  },

  writing: {
    _readme: function () {
      // TODO generate own readme
      this.fs.template(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {

        }
      );
    },

    app: function () {
      this.fs.copyTpl(
        this.templatePath('app/index.js'),
        this.destinationPath(this.generatorsPrefix, 'app/index.js'),
        {
          superb: superb(),
          generatorName: _s.classify(this.generatorName)
        }
      );

      var pkg = this.fs.readJSON(this.destinationPath('package.json'));
      pkg.dependencies = _.extend(pkg.dependencies || {}, {
        'yeoman-generator': '^0.19.0',
        chalk: '^1.0.0',
        yosay: '^1.0.2'
      });
      pkg.devDependencies = _.extend(pkg.devDependencies || {}, {
        'yeoman-assert': '^2.0.0'
      });
      pkg.keywords = pkg.keywords || [];
      pkg.keywords.push('yeoman-generator');
      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    templates: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath(this.generatorsPrefix, 'app/templates/editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath(this.generatorsPrefix, 'app/templates/jshintrc')
      );
      this.fs.copy(
        this.templatePath('app/templates/_package.json'),
        this.destinationPath(this.generatorsPrefix, 'app/templates/_package.json')
      );
      this.fs.copy(
        this.templatePath('app/templates/_bower.json'),
        this.destinationPath(this.generatorsPrefix, 'app/templates/_bower.json')
      );
    },

    tests: function () {
      this.fs.copyTpl(
        this.templatePath('test-app.js'),
        this.destinationPath('test/test-app.js'),
        {
          prefix: this.generatorsPrefix,
          generatorName: this.generatorName
        }
      );
    }
  },

  install: function () {
    this.installDependencies({ bower: false });
  }
});
