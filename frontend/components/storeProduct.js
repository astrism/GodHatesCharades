app.directive('storeProduct', function($animate) {
  return {
    templateUrl: 'components/storeProduct.html',
    replace: true,
    scope: {
      storeItem: '=',
      increment: '=',
      decrement: '=',
      setQuantity: '=',
      quantity: '@'
    },
    controller: function($scope, $element) {
      $scope.product = $scope.storeItem.product;
      $scope.currentImage = $scope.product.images[0];
      $scope.selectImage = _selectImage;
      $scope.onIncrement = _onIncrement;
      $scope.onDecrement = _onDecrement;
      $scope.productQuantity = _productQuantityGetterSetter;

      function _selectImage (newImage) {
        $scope.currentImage = newImage;
      }

      function _productQuantityGetterSetter(newQuantity) {
        if(angular.isDefined(newQuantity) && $scope.setQuantity) {
          console.log('set quantity', newQuantity);
          $scope.setQuantity(newQuantity, $scope.product);
        }

        return $scope.quantity;
      }

      function _onIncrement(event, product) {
        _animateButton(event.currentTarget);
        $scope.increment(product);
      }

      function _onDecrement(event, product) {
        _animateButton(event.currentTarget);
        $scope.decrement(product);
      }

      function _animateButton (button) {
        if(!button.classList.contains('click-satisfaction')) {
          $animate.addClass(button, 'click-satisfaction', function () {
              button.classList.remove('click-satisfaction');
          });
        }
      }
    }
  }
});