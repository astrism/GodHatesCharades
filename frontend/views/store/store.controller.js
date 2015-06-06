'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window) {
  // private
  var _cart = [];

  // public
  $scope.collection = collection;
  $scope.cart = _cart;
  // $scope.countItems = _countItems;
  $scope.buyUrl = _buyUrl;
  $scope.decrement = _decrement;
  $scope.increment = _increment;
  $scope.getCountById = _getCountById;
  $scope.getProductLayer = _getProductLayer;

  // Init

  // default to true so we can hack/preload the cart image
  $scope.isCartFull = true;
  $timeout(function() {
    $scope.isCartFull = false;
  }, 50);

  // methods
  function _increment(product) {
    $scope.isCartFull = true;
    if(product.mainVariantId) {
      var item = _tempItem(product.mainVariantId);
      _cart.push(item);
    }
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.findLastIndex(_cart, function (item) {
        return item.variant == product.mainVariantId;
      });
      if(index > -1) {
        _cart.splice(index, 1);
      }
    }
    if(_cart.length === 0) {
      $scope.isCartFull = false;
    }
  }

  function _tempItem(variant) {
    return {
      variant: variant,
      added: new Date().getTime()
    }
  }

  function _buyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    var counts = _.countBy(_cart);
    _.each(counts, function(quantity, item) {
      itemsToAdd.push(item.variant + ':' + quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }

  function _getCountById(id) {
    var count = 0;
    _.each(_cart, function(cartItem) {
      if(id === cartItem.variant)
        count++;
    });
  }

  function _getProductLayer(index) {
    return {
      'z-index': _cart.length - index
    };
  }
});