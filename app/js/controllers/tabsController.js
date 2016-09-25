import _ from 'lodash';

function TabsController ($scope, $http, Search, $filter) {
  'ngInject';

  let filter = $filter('filter');

  $scope.search = Search.scopeMixins;

  function groupByComposer (data) {
    let filteredData = filter(data, {
      composerName: $scope.search.composer,
      name:         $scope.search.songName,
      difficulty:   $scope.search.difficulty
    });

    return _.groupBy(filteredData, 'composerName');
  }

  $scope.getTabData = function () {
    $scope.loadingData = true;

    $http.get('data/tabs_flat.json').then(function (response) {
      $scope.tabData         = response.data;
      $scope.filteredTabData = groupByComposer($scope.tabData.tabs);
      $scope.loadingData     = false;
    }, function (error) {
      $scope.loadingData = false;
      $scope.error       = error;
    });
  }

  // Because digest cycles on functions don't play nicely.
  $scope.$watch('search', function (newValue, oldValue) {
    // There's no data, don't bother.
    if (!$scope.tabData) return;

    $scope.filteredTabData = groupByComposer($scope.tabData.tabs);
  }, true);

  $scope.getTabData();
}

export default {
  name: 'TabsController',
  fn: TabsController
};
