/* global angular */
(function() {
  
  'use strict';

  var app = angular.module('arTools', ['ngRoute', 'firebase', 'formly', 'formlyFoundation'], function config(formlyConfigProvider) {
    // set templates here
    formlyConfigProvider.setType({
      name: 'custom',
      templateUrl: 'custom.html'
    });
  });
  
  app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.
      when('/period', {
        templateUrl: 'views/period.html'
      }).
      when('/notebook', {
        templateUrl: 'views/notebook.html'
      }).
      when('/solar', {
        templateUrl: 'views/solar.html'
      }).
      when('/concepts', {
        templateUrl: 'views/concepts.html'
      }).otherwise({
        redirectTo: '/index.html'
      });
  }]);

  app.controller('MainCtrl', function MainCtrl($scope, $firebaseObject, formlyVersion) {
    var ref = new Firebase("https://arnotebook.firebaseio.com/");
    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.exampleTitle = 'Notebook';
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };

    vm.model = {
      ready: true
    };
    
    vm.awesomeIsForced = false;

    vm.formFields = [
      {
        key: 'text',
        type: 'input',
        templateOptions: {
          label: 'Name',
          placeholder: 'Input the alien or planet name here. For example: Akona, Charon, etc.'
        }
      },
      {
        key: 'story',
        type: 'textarea',
        templateOptions: {
          label: 'Atomsphere',
          placeholder: 'Type what you found about Atomsphere here.'
        }
      },
      {
        key: 'temperature',
        type: 'input',
        templateOptions: {
          label: 'Temperature',
          placeholder: 'Input the temperature you found.'
        }
      },
      {
        key: 'custom',
        type: 'custom',
        templateOptions: {
          label: 'Gravity',
        }
      },
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Notes',
        }
      },
      {
        key: 'ready',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': function() {
            return vm.awesomeIsForced;
          },
          'templateOptions.label': function() {
            if (vm.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Finish ? (uncheck this and see what happens)';
            }
          }
        }
      },
      {
        key: 'whyNot',
        type: 'textarea',
        expressionProperties: {
          'templateOptions.disabled': 'false'
        },
        hideExpression: 'model.ready',
        templateOptions: {
          label: 'Why Not?',
          placeholder: 'Type in here... I dare you'
        },
        watcher: {
          listener: function(field, newValue, oldValue, scope, stopWatching) {
            if (newValue) {
              console.log(newValue);
              stopWatching();
              scope.model.ready = true;
              scope.model.whyNot = undefined;
              field.expressionProperties.hide = null;
              field.expressionProperties['templateOptions.disabled'] = 'true';
              field.templateOptions.placeholder = 'Too bad... It really is awesome!  Wasn\'t that cool?';
              vm.awesomeIsForced = true;
            }
          }
        }
      }
    ];

    // function definition
    function onSubmit() {
      alert(JSON.stringify(vm.model), null, 2);
    }
  });

  
  app.directive('exampleDirective', function() {
    return {
      templateUrl: 'example-directive.html'
    };
  });
})();
