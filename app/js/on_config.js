function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('Home', {
      name: 'home',
      url: '/',
      controller: 'TabsController as home',
      templateUrl: 'home.html',
      title: 'Tabs'
    });
}

export default OnConfig;
