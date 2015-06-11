/* global angular */
(function() {
  
  'use strict';

  var app = angular.module('arTools', ['ngRoute', 'firebase', 'formly', 'formlyFoundation'], function config(formlyConfigProvider) {
    // set templates here
    formlyConfigProvider.setType({
      name: 'custom',
      templateUrl: 'custom.html'
    });

    // formlyConfigProvider
    formlyConfigProvider.setWrapper([
      {
        template: [
          '<formly-transclude></formly-transclude>',
          '<div class="validation"',
          '  ng-if="showError"',
          '  ng-messages="fc.$error">',
          '  <div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
          '    {{message(fc.$viewValue, fc.$modelValue, this)}}',
          '  </div>',
          '</div>'
        ].join(' ')
      }
    ]);

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

  app.run(function run(formlyValidationMessages) {
    formlyValidationMessages.addStringMessage('required', 'This field is required');
  });

  app.controller('MainCtrl', function MainCtrl($scope, $firebaseObject, formlyVersion) {
    var ref = new Firebase("https://arnotebook.firebaseio.com/");
    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;
    ref.push({name:name, atomsphere:atomsphere, temperature:temperature});

    // variable assignment
    vm.exampleTitle = 'Notebook';
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };

    vm.formFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          placeholder: 'Input the alien or planet name here. For example: Akona, Charon, etc.',
          required: true
        },
        validation: {
          show: true
        }
      },
      {
        key: 'atomsphere',
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
      }
    ];

    // function definition
    function onSubmit() {
      alert(JSON.stringify(vm.model), null, 2);
     // ref.push({name:name, atomsphere:atomsphere, temperature:temperature});
    }


  });


})();
