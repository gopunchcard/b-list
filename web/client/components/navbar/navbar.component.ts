'use strict';
/* eslint no-sync: 0 */
const angular = require('angular');

export class NavbarComponent {
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];
  isCollapsed = true;


}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
