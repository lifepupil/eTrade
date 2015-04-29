'use strict';

angular.module('eTrade')
.factory('Portfolio', function($rootScope, $firebaseArray, $window, $http){

  function Portfolio(){
  }

  Portfolio.currentPrice = function(symbol) {
    return $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=JSON_CALLBACK');
  };

  Portfolio.getStocks = function(portfolio){
    var fbPortfolios = $rootScope.fbUser.child('portfolios/' + portfolio);
    return $firebaseArray(fbPortfolios);
  };

  Portfolio.addStock = function(stock, portfolio){
    var fbPortfolios = $rootScope.fbUser.child('portfolios/' + portfolio);
    var afPortfolios = $firebaseArray(fbPortfolios);

    stock.purchasedOn = $window.Firebase.ServerValue.TIMESTAMP;
    return afPortfolios.$add(stock);
  };

  Portfolio.add = function(name){
    var names = $rootScope.afUser.names ? $rootScope.afUser.names.split(',') : [];
    names.push(name);
    $rootScope.afUser.names = names.join(',');
    return $rootScope.afUser.$save();
  };

  return Portfolio;
});
