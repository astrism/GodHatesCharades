app.factory('Suggestion', function (DS, $q, Slug, $urlMatcherFactory, $state, $filter, ParseData, SetItem, ParseDataSimplifier) {
	// vars
	var definition = {
		name: 'suggestion',
		defaultAdapter: 'suggestionAdapter',
		computed: {
			ownerId: ['owner', _updateOwnerId],
			votes: ['totalVotes', ParseData.defaultValueHandler(0)],
			skips: ['skipped', ParseData.defaultValueHandler(0)],
			views: ['votes', 'skips', _updateViews],
			slug: ['text', _updateSlug],
			link: ['slug', 'id', _updateLink],
			kdr: ['votes', 'skips', _updateKdr],
			styleClass: ['type', 'spite', _updateStyleClass],
			typeDisplay: ['type', _updateTypeDisplay],
			url: ['link', _updateUrl],
			imageUrl: ['type', 'spite', _updateImageUrl],
			textLines: ['text', 'legal', _updateTextLines]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks,
			getSetItems: _getSetItems,
			addSetItems: _addSetItems,
			addSetItem: _addSetItem,
			removeSetItem: _removeSetItem,
			removeSetItems: _removeSetItems
		},
		beforeInject: _beforeInject
	}

	// Adapter
	DS.adapters.suggestionAdapter = {
		find: _find,
		create: _create,
		update: _update
	};

	// Constants
	var TYPE_DISPLAY_CHARACTER = 'Actor';
	var TYPE_DISPLAY_SCENARIO = 'Scenario';
	var TYPE_CLASS_CHARACTER = 'character';
	var TYPE_CLASS_SCENARIO = 'scenario';
	var SPITE_CLASS = 'spite';
	var RELATIONS = ['user'];
	var INJECT_OPTIONS = {
	};

	var Suggestion = DS.defineResource(definition);
	// Static Methods
	Suggestion.getBlankCardByType = _getBlankCardByType;
	Suggestion.getTypeDisplayByType = _getTypeDisplayByType;
	Suggestion.getTypeClassByType = _getTypeClassByType;
	Suggestion.getExamples = _getExamples;
	Suggestion.getUnmoderatedSuggestions = _getUnmoderatedSuggestions;
	Suggestion.getSuggestionPairs = _getSuggestionPairs;
	Suggestion.getAllApprovedSuggestions = _getAllApprovedSuggestions;

	return Suggestion;

	// methods

	function _beforeInject(resourceName, parseObject){
		ParseData.linkProperty(parseObject, 'user', 'owner');
	}

	// function _afterInject(resourceName, parseObject) {
	// 	parseObject.updateLinks();
	// }

	function _updateLinks() {
		// if(!relations) relations = RELATIONS;
		ParseData.linkRelationsAfterInject(Suggestion, RELATIONS, this);
		// Suggestion.linkInverse(this.id);
	}

	function _addSetItems(setItems) {
		_.each(setItems, this.addSetItem);
	}

	function _addSetItem(setItem) {
		if(!this.setItems) {
			this.setItems = [setItem];
			this.sets = [setItem.owner];
		} else {
			if(this.setItems.indexOf(setItem) === -1) {
				// add to set if its not already there
				this.setItems.push(setItem);
			}
			if(this.sets.indexOf(setItem.owner) === -1) {
				this.sets.push(setItem.owner);
			}
		}
	}

	function _removeSetItems(setItems) {
		_.each(setItems, this.removeSetItems);
	}

	function _removeSetItem(setItem) {
		if(this.setItems) {
			var index = this.setItems.indexOf(setItem);
			if(index > -1) {
				this.setItems.splice(index, 1);
			}
			var index = this.sets.indexOf(setItem.owner);
			if(index > -1) {
				this.sets.splice(index, 1);
			}
		}
	}

	function _updateOwnerId(owner) {
		if(owner)
			return owner.id;
		else {
			console.log('why no owner');
		}
	}

	function _updateTypeDisplay(type) {
		return Suggestion.getTypeDisplayByType(type);
	}

	function _updateStyleClass(type) {
		var styleClass = Suggestion.getTypeClassByType(type);
		if(this.spite) styleClass = [styleClass, SPITE_CLASS].join(' ');
		return styleClass;
	}

	function _updateImageUrl(type) {
		if(this.spite) {
			return 'img/card_spite.svg';
		} else if(type === 0) {
			return 'img/card_actor.svg';
		} else if(type === 1) {
			return 'img/card_scenario.svg';
		}
	}

	function _updateSlug(text) {
		return Slug.slugify(text);
	}

	function _updateTextLines(text, legal) {
		if(text.length > 0) {
			var fullText = text;
			if(legal)
				fullText += legal;
			var wrapped = wordWrap(fullText, {
				width: 18,
				trim: true,
				indent: ''
			});
			return wrapped.toUpperCase().split('\n');
		} else {
			return [text + legal];
		}
	}

	function _updateLink(slug, id) {
		return {
			cardid: id,
			slug: slug
		};
	}

	function _updateUrl(link) {
		if(link) {
			var cardState = $state.get('card').url;
			var matcher = $urlMatcherFactory.compile(cardState);
			var path = matcher.format(link);
			return [
				'http://godhatescharades.com',
				path
			].join('');
		} else {
			return null;
		}
	}

	function _updateKdr(votes, skips) {
		if(!votes) votes = 1;
		if(!skips) skips = 1;

		var kdr = votes / skips;
		return kdr.toFixed(2);
	}

	function _updateViews(votes, skips) {
		var views = 0;
		if(votes) views += votes;
		if(skips) views += skips;
		return views;
	}

	function _linkSetItems() {
		var params = {
			where: {
				cardId: {
					'==': this.id
				}
			}
		};
		this.setItems = DS.filter('setItem', params);
		this.sets = _.pluck(this.setItems, 'owner');
	}

	function _getSetItems() {
		var params = {
			suggestionId: this.id
		};
		return SetItem.findAll(params)
		.then(_linkSetItems);
	}

	// class methods
	function _getBlankCardByType(type) {
		var blank = Suggestion.createInstance({
			type: type,
			text: '',
			spite: false,
			legal: ''
		});
		blank.DSCompute();
		return blank;
	}

	function _getTypeClassByType(type) {
		switch(type) {
			case 0 :
				return TYPE_CLASS_CHARACTER;
			case 1 :
				return TYPE_CLASS_SCENARIO;
			default :
				console.log('unhandled card type:', type);
				break;
		}
	}

	function _getTypeDisplayByType(type) {
		switch(type) {
			case 0 :
				return TYPE_DISPLAY_CHARACTER;
			case 1 :
				return TYPE_DISPLAY_SCENARIO;
		}
	}


	function _getAllApprovedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSuggestions',
			{},
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getExamples() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'examples',
			{
				id: CONFIG.EXAMPLE_SET_ID
			},
			{
				success: function(examples) {
					// _cache(suggestions);
					//TODO: Setup injection
					// DS.inject(definition.name, examples);
					deferred.resolve(examples);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _getUnmoderatedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getUnmoderatedSuggestions',
			{}, 
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _onSuggestionListSuccess(suggestions) {
		suggestions = ParseData.inject('suggestion', suggestions);
		this.resolve(suggestions);
		// ParseData.safeInject('suggestion', suggestions)
		// .then(this.resolve);
	}

	function _getSuggestionPairs(skip) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getRandomSuggestionPairs',
			{
				skip: skip
			}, 
			{
				success: function(pairs) {
					_.each(pairs, function(pair) {
						pair['0'] = ParseData.inject('suggestion', pair['0']);
						pair['1'] = ParseData.inject('suggestion', pair['1']);
					})
					deferred.resolve(pairs);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	// adapter methods

	function _find(resource, id) {
		var cached = Suggestion.get(id);

		if(cached) {
			return $q.when(cached);
		} else {
			// else fetch data
			var options = {
				id: id
			};
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardById', options);
		}
	}

	function _create(resourceName, attrs) {
		var user = new Parse.User();
		user.id = attrs.userId;
		var SuggestionObj = Parse.Object.extend('Suggestion');
		var suggestion = new SuggestionObj();
		suggestion.set('text', attrs.text);
		suggestion.set('type', attrs.type);
		suggestion.set('owner', user);
		return suggestion.save();
	}

	function _update(resource, id, attrs) {
		return Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'updateSuggestionText',
			attrs,
			{
				success: onSuggestionSaved
			}
		);

		function onSuggestionSaved (updatedSuggestion) {
			var suggestion = Suggestion.get(id);
			_.extend(suggestion, updatedSuggestion.attributes);
			return suggestion;
		}
	}
});