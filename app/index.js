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
    this.composeWith('node:app', {
      options: {boilerplate: false}
    }, {
      local: require('generator-node').app
    });

    this.composeWith('generator:base', {
      options: {flat: this.options.flat}
    }, {
      local: require.resolve('../base')
    });
  }
});
