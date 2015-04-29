'use strict';

angular.module('eTrade')
.controller('PortfoliosShowCtrl', function($scope, $state, Portfolio, Stock, $rootScope, $firebaseArray){
  console.log('PortfoliosShowCtrl initialized');
  $scope.name = $state.params.name;
  console.log('scope name', $scope.name);
  $scope.stocks = Portfolio.getStocks($state.params.name);
  console.log('scope stocks', $scope.stocks);
  $scope.stocks.$watch(computePosition);

  // $scope.currentPrice = function() {
  // };

  $scope.sellStock = function(stock, index) {
    Portfolio.currentPrice(stock.symbol.toUpperCase())
    .then(function(response) {
      var total = response.data.LastPrice * stock.quantity;

      console.log($rootScope.afUser.balance, total);
      $rootScope.afUser.balance += total;
      $rootScope.afUser.$save();

      console.log($rootScope.afUser.balance);

      var fbPortfolios = $rootScope.fbUser.child('portfolios/' + $state.params.name);
      var afPortfolios = $firebaseArray(fbPortfolios);

      afPortfolios.$loaded().then(function() {
        afPortfolios.$remove(index);
      });
    });
  };

  $scope.purchase = function(s){
    var stock = new Stock(s);
    stock.getQuote()
    .then(function(response){
      stock.quote = response.data.LastPrice;
      if(stock.purchase()){
        Portfolio.addStock(stock, $state.params.name).then(clearFields);
      }
    });
  };

  function clearFields(){
    $scope.stock = null;
  }

  function computePosition(){
    $scope.position = $scope.stocks.reduce(function(acc, stock){
      return acc + stock.position;
    }, 0);
  }
});
