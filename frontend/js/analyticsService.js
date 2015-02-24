app.service('analytics', function($mixpanel, $location, $state) {
	var analyticsService = {
		getPageTitle: _getPageTitle,
		getPageUrl: _getPageUrl,
		mpEvent: _mpEvent,
		mpFirstLoad: _mpFirstLoad
	};

	function _getPageTitle() {
		if($state.current.title) {
			return $state.current.title;
		} else if($state.current.parent) {
			return $state.current.parent.title;
		} else {
			return 'God Hates Charades';
		}
	}

	function _getPageUrl() {
		return $location.host() + $location.path()
	}

	function _mpEvent(eventTitle, eventOptions) {
		var defaultOptions = {
			'Page Title': _getPageTitle(),
			'Page Url': _getPageUrl()
		};
		var options = _.extend(defaultOptions, eventOptions);
		$mixpanel.track(eventTitle, options);
	}

	function _mpFirstLoad() {
		$mixpanel.register({
			'Landing Page Title': _getPageTitle(),
			'Landing Page Url': _getPageUrl()
		});
	}

	return analyticsService;
});