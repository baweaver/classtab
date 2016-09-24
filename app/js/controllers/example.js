function TabsController ($scope, $http) {
  'ngInject';

  $http.get('/data/tabs.json').then(function (data) {
    console.log(data);
    $scope.data = data.data;
  })
}

export default {
  name: 'TabsController',
  fn: TabsController
};
