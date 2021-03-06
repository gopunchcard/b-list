'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>'
    })
    .state('register', {
      url: '/register',
      template: '<register></register>'
    });
}
