app.directive('hnFrameLoad', function() {
  return {
    restrict: 'A',
    scope: {
      callBack: '&hnFrameLoad'
    },
    link: function(scope, element, attrs) {
      console.log("Hello");
      element.on('load', function() {
      });
    }
  }
});

app.service('HNStories', ['$http', function($http) {
  var stories = [];

  return {
    getStory: function(id) {
      return $http.get('https://hacker-news.firebaseio.com/v0/item/'+id+'.json');
    }
  }
}]);

app.controller('HNController', ['$scope', '$http', 'HNStories', function($scope, $http, HNStories) {
  $scope.stories = [];

  $scope.getStories = function() {
    var max = 10;
    var req = $http.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    req.success(function(data, status, headers, config) {
      angular.forEach(data.slice(0, 10), function(value, key) {
        HNStories.getStory(value).success(function(data) {
          $scope.stories.push(data);
        });
      });
    });
  }

  $scope.getStories();
}]);

app.controller('HNStoryController', function($scope, $stateParams, $sce, HNStories) {
  HNStories.getStory($stateParams.id).success(function(data) {
    $scope.story = data;
  })
  .then(function(data) {
    $scope.comments = [];
    angular.forEach($scope.story.kids, function(value, key) {
      HNStories.getStory(value).success(function(data) {
        $scope.comments.push(data);
      });
    });
  });
  $scope.trust = function(url) {
    return $sce.trustAsResourceUrl(url);
  }
  $scope.trustHtml = function(html) {
    return $sce.trustAsHtml(html);
  }
});