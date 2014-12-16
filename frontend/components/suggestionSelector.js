'use strict';
app.directive('suggestionSelector', function(cardService, $filter, $state, $modal) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/suggestionSelector.html',
		replace: true,
		scope: {
			search: '=search'
		},
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.loading = false;
			$scope.suggestions = [];
			$scope.allLoaded = false;
			$scope.tab = 'best';
			$scope.$watch('search', _onSearchUpdated);

			// Public methods
			$scope.checkEscape = _checkEscape;
			$scope.reloadSuggestions = function(tab) {
				$scope.tab = tab;
				$scope.suggestions = [];
				$scope.allLoaded = false;
				$scope.loadSuggestions();
			};

			$scope.loadSuggestions = function() {
				// console.log($state.current.name);
				if(!$scope.loading && !$scope.allLoaded) {
					var callbacks = {
						success: onSuggestionsLoaded,
						error: onSuggestionsError
					};
					$scope.loading = true;
					Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getAllSuggestions', options, callbacks);
				}
			};

			$scope.selectSuggestion = function(suggestion) {
				console.log('selectSuggestion');
				$scope.$emit('suggestionAdded', suggestion);
			};

			$scope.editSuggestion = _editSuggestion;

			// Private methods

			function onSuggestionsLoaded(suggestions) {
				$scope.allLoaded = true;
				cardService.cache(suggestions);
				$scope.suggestions = $scope.suggestions.concat(suggestions);
				$scope.loading = false;
				$scope.$digest();
			}

			function onSuggestionsError(error) {
				console.log('couldn\'t find any pairs:', error);
			}

			function _onSearchUpdated(newValue) {
				$scope.searchSelector = newValue;
			}

			function _checkEscape(event) {
				if(event.keyCode === 27)
					angular.element(event.target).scope().editing = false;
			}

			function _editSuggestion(isolatedScope, suggestion) {
				var modalScope = $scope.$new(true);
				modalScope.suggestion = suggestion;
				modalScope.onSuccess = _onEditSuccess;
				modalScope.onError = _onEditError;

				var modalInstance = $modal.open({
					templateUrl: 'components/cardForm.modal.html',
					scope: modalScope,
					size: 'sm'
				})

				function _onEditSuccess() {
					console.log('modal success');
					modalInstance.dismiss();
				}

				function _onEditError(err) {
					console.log('modal error');
					modalInstance.dismiss();
				}
			}

			// // init
			$scope.loadSuggestions();

		}
	};
});