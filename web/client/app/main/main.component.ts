'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './main.routes';

export class MainComponent {
  macList: [any];

  /*@ngInject*/
  constructor($q : ng.IQService) {
    this.macList = [
    {
      Mac: "a4-5e-60-c8-9f-34",
      Name: "Ian Phillipchuk"
    }, 
    {
      Mac: "a4-5e-60-c8-9f-35",
      Name: "Mark Zacharias"
    },
    {
      Mac: "a4-5e-60-c8-9f-36",
      Name: "Terence Leung"
    }
  ];

    setInterval(() =>
    {
      this.pollApis($q);
    }, 10000);
  }
  
  pollApis($q) {
    console.log("Polling!");
    $q.when([
      {
        Mac: "a4-5e-60-c8-9f-35",
        Name: "Mark Zacharias"
      }, 
      {
        Mac: "a4-5e-60-c8-9f-34",
        Name: "Ian Phillipchuk"
      },
      {
        Mac: "a4-5e-60-c8-9f-36",
        Name: "Terence Leung"
      }
    ]).then((users) => 
    {
      this.macList = users;
    });
  }
}

export default angular.module('webApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.html'),
    controller: MainComponent,
    controllerAs: 'mainCtrl'
  })
  .name;
