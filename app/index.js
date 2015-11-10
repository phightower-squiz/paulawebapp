'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {
    var testLocal;

    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });

    if (this.options['test-framework'] === 'mocha') {
      testLocal = require.resolve('generator-mocha/generators/app/index.js');
    } else if (this.options['test-framework'] === 'jasmine') {
      testLocal = require.resolve('generator-jasmine/generators/app/index.js');
    }

    this.composeWith(this.options['test-framework'] + ':app', {
      options: {
        'skip-install': this.options['skip-install']
      }
    }, {
      local: testLocal
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a Gruntfile to build your app.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      }, {
        name: 'Modernizr',
        value: 'includeModernizr', 
        checked: true
      }, 
      {
        name: 'SlickSlider',
        value: 'includeSlickSlider',
        checked: true
      }]
    }, {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true,
      when: function (answers) {
        return answers.features.indexOf('includeBootstrap') === -1;
      }
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeSlickSlider = hasFeature('includeSlickSlider');
      this.includeJQuery = answers.includeJQuery;

      done();
    }.bind(this));
  },

  writing: {
    gruntfile: function () {
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        {
          pkg: this.pkg,
          includeSass: this.includeSass,
          includeBootstrap: this.includeBootstrap,
          includeModernizr: this.includeModernizr,
          testFramework: this.options['test-framework'],
          useBabel: this.options['babel']
        }
      );
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          includeSass: this.includeSass,
          includeModernizr: this.includeModernizr,
          testFramework: this.options['test-framework'],
          useBabel: this.options['babel']
        }
      )
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    bower: function () {
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        if (this.includeSass) {
          bowerJson.dependencies['bootstrap-sass'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap-sass': {
              'main': [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.dependencies['bootstrap'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
        }
      } else if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.1.4';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.3';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    scripts: function () {
      this.fs.copy(
        this.templatePath('global.js'),
        this.destinationPath('app/scripts/global.js')
      );
      this.fs.copy(
        this.templatePath('global-config.js'),
        this.destinationPath('app/scripts/global-config.js')
      );
      this.fs.copy(
        this.templatePath('require.js'),
        this.destinationPath('app/scripts/require.js')
      );
      this.fs.copy(
        this.templatePath('modules/get-data.js'),
        this.destinationPath('app/scripts/modules/get-data.js')
      );
      this.fs.copy(
        this.templatePath('modules/menus.js'),
        this.destinationPath('app/scripts/modules/menus.js')
      );
      this.fs.copy(
        this.templatePath('modules/sliders.js'),
        this.destinationPath('app/scripts/modules/sliders.js')
      );
      
      this.fs.copy(
        this.templatePath('jquery.min.js'),
        this.destinationPath('app/scripts/vendor/jquery.min.js')
      );
      if(this.includeSlickSlider) {
        this.fs.copy(
          this.templatePath('modules/plugins/slick.js'),
          this.destinationPath('app/scripts/modules/plugins/slick.js')
        );
      }
    },

    styles: function () {
      var stylesheet, stylesheetMed, stylesheetWide, stylesheetGrid, boilerPlate, functions, mixins, norm, variables, header, headerD, nav, navD, footer, slider;

        stylesheet = 'main.scss';
        stylesheetMed = 'medium.scss';
        stylesheetWide = 'wide.scss';
        stylesheetGrid = 'grid.scss';
        boilerPlate = 'boilerplate.scss';
        functions = 'functions.scss';
        mixins = 'mixins.scss';
        norm = 'normalize.scss';
        variables = 'variables.scss';
        header = 'header.scss';
        headerD = 'header_desktop.scss';
        nav = 'nav.scss';
        navD = 'nav_desktop.scss';
        footer = 'footer.scss';
        slider = 'slider.scss';
        

      this.fs.copyTpl(
        this.templatePath(stylesheet),
        this.destinationPath('app/styles/' + stylesheet),
        {
          includeBootstrap: this.includeBootstrap
        }
      );

      this.fs.copyTpl(
        this.templatePath(stylesheetMed),
        this.destinationPath('app/styles/' + stylesheetMed)
      );

      this.fs.copyTpl(
        this.templatePath(stylesheetWide),
        this.destinationPath('app/styles/' + stylesheetWide)
      );

      this.fs.copyTpl(
        this.templatePath(stylesheetGrid),
        this.destinationPath('app/styles/imports/' + stylesheetGrid)
      );

      this.fs.copyTpl(
        this.templatePath(boilerPlate),
        this.destinationPath('app/styles/imports/' + boilerPlate)
      );

      this.fs.copyTpl(
        this.templatePath(functions),
        this.destinationPath('app/styles/imports/' + functions)
      );

      this.fs.copyTpl(
        this.templatePath(mixins),
        this.destinationPath('app/styles/imports/' + mixins)
      );

      this.fs.copyTpl(
        this.templatePath(norm),
        this.destinationPath('app/styles/imports/' + norm)
      );

      this.fs.copyTpl(
        this.templatePath(variables),
        this.destinationPath('app/styles/imports/' + variables)
      );
      this.fs.copyTpl(
        this.templatePath(header),
        this.destinationPath('app/styles/modules/' + header)
      );
      this.fs.copyTpl(
        this.templatePath(headerD),
        this.destinationPath('app/styles/modules/' + headerD)
      );
      this.fs.copyTpl(
        this.templatePath(nav),
        this.destinationPath('app/styles/modules/' + nav)
      );
      this.fs.copyTpl(
        this.templatePath(navD),
        this.destinationPath('app/styles/modules/' + navD)
      );
      this.fs.copyTpl(
        this.templatePath(footer),
        this.destinationPath('app/styles/modules/' + footer)
      );
      this.fs.copyTpl(
        this.templatePath(slider),
        this.destinationPath('app/styles/modules/' + slider)
      );
      if(this.includeSlickSlider) {
        this.fs.copyTpl(
          this.templatePath('plugins/slick.scss'),
          this.destinationPath('app/styles/plugins/slick.scss')
        );
      }
      
    },

    html: function () {
      var bsPath;

      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        if (this.includeSass) {
          bsPath = '/bower_components/bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath = '/bower_components/bootstrap/js/';
        }
      }

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'),
        {
          appname: this.appname,
          includeSass: this.includeSass,
          includeBootstrap: this.includeBootstrap,
          includeModernizr: this.includeModernizr,
          bsPath: bsPath,
          bsPlugins: [
            'affix',
            'alert',
            'dropdown',
            'tooltip',
            'modal',
            'transition',
            'button',
            'popover',
            'carousel',
            'scrollspy',
            'collapse',
            'tab'
          ]
        }
      );
    },

    icons: function () {
      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      this.fs.copy(
        this.templatePath('apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );

      this.fs.copy(
        this.templatePath('logo.png'),
        this.destinationPath('app/images/logo.png')
      );
    },

    robots: function () {
      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('app/robots.txt')
      );
    },

    misc: function () {
      //mkdirp('app/images');
      mkdirp('app/fonts');
      this.fs.copy(
        this.templatePath('siteconfig.json'),
        this.destinationPath('app/siteconfig.json')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },

  end: function () {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('grunt wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    // wire Bower packages to .html
    wiredep({
      bowerJson: bowerJson,
      src: 'app/index.html',
      exclude: ['bootstrap.js'],
      ignorePath: /^(\.\.\/)*\.\./
    });

    if (this.includeSass) {
      // wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        src: 'app/styles/*.scss',
        ignorePath: /^(\.\.\/)+/
      });
    }
  }
});
