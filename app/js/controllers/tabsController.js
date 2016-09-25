function TabsController ($scope, $http, Search) {
  'ngInject';

  $scope.search = Search.scopeMixins;

  $scope.difficulties = [
    undefined,
    'easy',
    'intermediate',
    'advanced',
    'expert'
  ];

  $http.get('data/tabs.json').then(function (response) {
    $scope.tabData = response.data;
  });
}

export default {
  name: 'TabsController',
  fn: TabsController
};
