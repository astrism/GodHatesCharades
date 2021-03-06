app.factory('Discount', function (DS, $q, ParseData) {
  // vars
  var definition = {
    name: 'discount',
    defaultAdapter: 'discountAdapter',
    computed: {
    },
    methods: {
      // Instance methods
    }
  }

  // Adapter
  DS.adapters.discountAdapter = {
    findAll: _findAll,
    update: _update,
    create: _create,
    destroy: _destroy
  };


  // init
  var Discount = DS.defineResource(definition);
  var props = [
    'id',
    'code',
    'url',
    'paramKey',
    'paramValue',
    'feature'
  ];

  // static methods
  Discount.getFeaturedDiscount = _getFeaturedDiscount;
  Discount.getDiscountByParams = _getDiscountByParams;

  return Discount;

  // definition methods

  // adapter methods
  function _findAll(resource, id) {
    return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getAllDiscounts');
  }

  function _update(resource, id, attrs) {
    var discount = _.pick(attrs, props);
    return Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'updateDiscount',
      discount
    );
  }

  function _create(resource, attrs) {
    var discount = _.pick(attrs, props);
    return Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'createDiscount',
      discount
    );
  }

  function _destroy(resource, id) {
    var discount = Discount.get(id);
    return Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'destroyDiscount',
      discount
    );
  }

  // class methods

  function _getFeaturedDiscount() {
    var deferred = $q.defer();
    Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'getFeaturedDiscount',
      {}, 
      {
        success: _onFetchedDiscount.bind(deferred),
        error: deferred.reject
      }
    );

    return deferred.promise;
  }

  function _getDiscountByParams(params) {
    var deferred = $q.defer();
    Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'getDiscountByParams',
      params, 
      {
        success: _onFetchedDiscount.bind(deferred),
        error: deferred.reject
      }
    );

    return deferred.promise;
  }

  function _onFetchedDiscount(discount) {
    if(discount) {
      discount = ParseData.inject('discount', discount);
      this.resolve(discount);
    } else {
      this.reject();
    }
  }

  // instance methods




});