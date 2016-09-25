function TabsController ($scope, $http, Search) {
  'ngInject';

  $scope.search = Search.scopeMixins;

  $http.get('/data/tabs.json').then(function (response) {
    $scope.tabData = response.data;
  });
}

export default {
  name: 'TabsController',
  fn: TabsController
};
