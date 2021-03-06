'use strict';
app.directive('prompt', function($window) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/prompt.html',
		replace: true,
		scope: {
			message: '@message',
			hide: '=hide',
			social: '=social', //boolean
			socialMessage: '@socialMessage', //boolean
			closable: '=closable', //boolean
			messageTemplateUrl: '@messageTemplate'
		},
		controller: function($scope) {
			$scope.$window = $window;
			$scope.promptBlockClasses = {
				'col-xs-8': $scope.social,
				'col-sm-9': $scope.social,
				'col-md-10': $scope.social,
				'col-lg-10': $scope.social,
				'col-xs-12': !$scope.social,
				'col-sm-12': !$scope.social,
				'col-md-12': !$scope.social,
				'col-lg-12': !$scope.social,
			};
			$scope.sharingConfig = {
				title: $scope.socialMessage
			}
		}
	};
});