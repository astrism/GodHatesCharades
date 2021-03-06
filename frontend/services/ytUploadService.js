'use strict';
app.service('ytUploadService', function($window, $q, $rootScope, youtubeEmbedUtils) {
	// console.log('instantiate ytUploadService');
	var ytUploadService = {
		waitForLoad: _waitForLoad,
		createUpload: _createUpload
	};

	var deferred = $q.defer();
	
	var windowWatcher = $rootScope.$watch(_checkLoad, _onLoaded);

	function _checkLoad() {
		return youtubeEmbedUtils.ready;
	}

	function _onLoaded(loaded) {
		if(loaded) {
			console.log('_onIframeApiReady');
			windowWatcher(); //destroy the window watcher
			ytUploadService.ready = true;
			deferred.resolve();
		}
	}

	function _createUpload(name, settings) {
		return new YT.UploadWidget(name, settings);
	}

	function _waitForLoad(callback) {
		return deferred.promise;
	}

	return ytUploadService;
});