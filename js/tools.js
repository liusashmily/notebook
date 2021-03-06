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

  app.controller('MainCtrl', function MainCtrl($scope, $firebaseArray, formlyVersion) {
    var ref = new Firebase("https://arnotebook.firebaseio.com/");
    //var ref = new Firebase("https://lisaso.firebaseio-demo.com/");

    $scope.notes = $firebaseArray(ref);


    // Attach an asynchronous callback to read the data at the notes reference
    ref.on("child_added", function(snapshot) {
      var newNote = snapshot.val();
      console.log("Name:" + newNote.name);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
 

    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

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
        key: 'gravity',
        type: 'textarea',
        templateOptions: {
          label: 'Gravity',
          placeholder: 'Type what you found about Gravity here.'
        }
      },
      {
        key: 'magnetism',
        type: 'textarea',
        templateOptions: {
          label: 'Magnetism',
          placeholder: 'Type what you found about Magnetism here.'
        }
      },
      {
        key: 'surface',
        type: 'textarea',
        templateOptions: {
          label: 'Surface',
          placeholder: 'Type what you found about Surface here.'
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
        key: 'notes',
        type: 'textarea',
        templateOptions: {
          label: 'Notes',
          placeholder: 'Type any other notes here.'
        }
      }
    ];

    // function definition
    function onSubmit() {
      alert(JSON.stringify(vm.model), null, 2);
      //ref.push({name:name, atomsphere:atomsphere, temperature:temperature});
      ref.push(vm.model);
    }


  });


})();
