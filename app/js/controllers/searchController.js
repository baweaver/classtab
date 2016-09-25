function SearchController ($scope, Search) {
  'ngInject';

  $scope.search = Search.scopeMixins;
}

export default {
  name: 'searchController',
  fn: SearchController
};
