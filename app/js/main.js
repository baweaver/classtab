import angular from 'angular';

// angular modules
import constants from './constants';
import onConfig  from './on_config';
import onRun     from './on_run';

import 'angular-ui-router';
import 'angular-ui-bootstrap';

import './templates';
import './filters';
import './controllers';
import './services';
import './directives';

// Bootstrap is NOTORIOUSLY touchy about jQuery being on Window
// and there're issues with ES6 loading modules so we have to
// fall back here.

// BOOTSTRAP HACK
window.$ = window.jQuery = require('jquery');
var Bootstrap = require('bootstrap-sass');
Bootstrap.$ = $;
require('../../node_modules/bootstrap-sass/assets/javascripts/bootstrap');
// END BOOTSTRAP HACK

// create and bootstrap application
const requires = [
  'ui.router',
  'templates',
  'app.filters',
  'app.controllers',
  'app.services',
  'app.directives',
  'ui.bootstrap'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
  strictDi: true
});
