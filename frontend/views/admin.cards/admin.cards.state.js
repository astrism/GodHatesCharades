'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.cards', {
		url: '/cards',
		title: 'Cards',
		templateUrl: 'views/admin.cards/admin.cards.html'
	});
});