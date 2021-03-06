'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('pair', {
		url: '/pair/:pairid/:slug',
		templateUrl: 'views/pair/pair.html',
		controller: 'pairView',
		resolve: {
			pair: function($stateParams, Pair) {
				return Pair.find($stateParams.pairid);
			},
			readyForUpload: function(ytUploadService) {
				return ytUploadService.waitForLoad();
			}
		}
	});
});