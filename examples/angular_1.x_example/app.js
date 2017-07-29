(function () {
  'use strict';

  var COUNTER_CHANGED = 'COUNTER_CHANGED';
  var USERS_SENT = 'USERS_SENT';

  var app = angular.module('app', []);

  app.service('eventEmitter', [function () {
    return new PubSub();
  }]);

  app.controller('ControllerA', ['$scope', '$timeout', 'eventEmitter', function ($scope, $timeout, eventEmitter) {
    // subscribe for 'COUNTER_CHANGED' events
    eventEmitter.subscribe(COUNTER_CHANGED, function (data) {
      $scope.counter = data.counter;
      $scope.$apply(); // Do not forget to call $apply when publishing events asynchronously
    });

    $scope.isCounterRegistered = true;

    $scope.sendUsers = function () {
      // publish 'USERS_SENT' event with some data
      eventEmitter.publishSync(USERS_SENT, {
        users: [
          {id: 1, name: 'John Doe'},
          {id: 2, name: 'George Smith'},
          {id: 3, name: 'Maria Dolores'}
        ]
      });
    };

    $scope.unsubscribeCounter = function () {
      eventEmitter.unsubscribe(COUNTER_CHANGED);
      $scope.isCounterRegistered = eventEmitter.hasSubscribers(COUNTER_CHANGED);
    };
  }]);

  app.controller('ControllerB', ['$scope', 'eventEmitter', function ($scope, eventEmitter) {
    var counter = 0;

    $scope.counterIncrease = function () {
      // publish 'COUNTER_CHANGED' event increasing the counter
      eventEmitter.publish(COUNTER_CHANGED, {
        counter: counter += 1
      });
    };

    $scope.counterDecrease = function () {
      // publish 'COUNTER_CHANGED' event decreasing the counter
      eventEmitter.publish(COUNTER_CHANGED, {
        counter: counter -= 1
      });
    };
  }]);

  app.controller('ControllerC', ['$scope', 'eventEmitter', function ($scope, eventEmitter) {
    eventEmitter.subscribe(USERS_SENT, function (data) {
      $scope.users = data.users;
    });
  }]);

}());
