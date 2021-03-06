'use strict';
app.directive('youtubeUpload', function(ytUploadService, analytics) {
	return {
		restrict: 'E',
		templateUrl: 'components/youtubeUpload.html',
		scope: {
			title: '=',
			description: '=',
			keywords: '=',
			onVideoReady: '='
		},
		controller: function($scope, $element) {
			$scope.uploadClass = _uploadClass;

			var widget = ytUploadService.createUpload('youtubeUpload', {
				width: 600,
				height: 300,
				events: {
					onStateChange: _onStateChange,
					onUploadSuccess: _onUploadSuccess,
					onProcessingComplete: _onProcessingComplete,
					onApiReady: _onApiReady
				}
			});

			function _onApiReady(event) {
				console.log('onapiready');
				widget.setVideoTitle($scope.title);
				widget.setVideoDescription($scope.description);
				widget.setVideoKeywords($scope.keywords);
			}

			function _onStateChange(event) {
				// https://developers.google.com/youtube/youtube_upload_widget#onStateChange
				switch(event.data.state) {
					case YT.UploadWidgetState.IDLE :
						// user has triggered the Record button, though recording has not yet started
						if(!$scope.recording) {
							console.log('recording');
							ga('send', 'event', 'youtube', 'recording', 'started');
							analytics.trackEvent('YouTube', {
								'State': 'Recording'
							});
						}
						$scope.recording = true;
						break;
					case YT.UploadWidgetState.STOPPED :
						console.log('recording stopped');
						$scope.status = 'Uploading to YouTube...';
						// user has triggered the Record button, though recording has not yet started
						$scope.recording = false;
						break;
					default :
						break;
				}

				$scope.$digest();
			}

			function _onUploadSuccess(event) {
				console.log('youtube upload complete');
				ga('send', 'event', 'youtube', 'upload', 'complete');
				analytics.trackEvent('YouTube', {
					'State': 'Uploaded'
				});
				$scope.status = 'YouTube is processing...';
			}

			function _onProcessingComplete(event) {
				console.log('youtube processing complete');
				$scope.status = 'Your video is complete, thanks for the submission!';
				analytics.trackEvent('YouTube', {
					'State': 'Processed',
					'VideoId': event.data.videoId
				});
				if($scope.onVideoReady)
					$scope.onVideoReady(event.data.videoId);
				$scope.$digest();
			}

			function _uploadClass() {
				if($scope.recording)
					return 'recording';
				else
					return '';
			}
		}
	}
});