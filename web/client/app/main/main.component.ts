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
      mac: "a4-5e-60-c8-9f-34",
      name: "Ian Phillipchuk",
      room: "1",
      date: this.inOut(new Date())
    }, 
    {
      mac: "a4-5e-60-c8-9f-35",
      name: "Mark Zacharias",
      room: "1",
      date: this.inOut(new Date())
    },
    {
      mac: "a4-5e-60-c8-9f-36",
      name: "Terence Leung",
      room: "1",
      date: this.inOut(new Date())
    }
  ];

    setInterval(() =>
    {
      this.pollApis($q);
    }, 10000);
  }
  
  pollApis($q) {
    console.log("Polling!");
    var now = new Date();
    $q.when([
      {
        mac: "a4-5e-60-c8-9f-34",
        name: "Ian Phillipchuk",
        room: "1",
        date: this.inOut(now)
      }, 
      {
        mac: "a4-5e-60-c8-9f-35",
        name: "Mark Zacharias",
        room: "1",
        date: this.inOut(now.setMinutes(now.getMinutes() - 5))
      },
      {
        mac: "a4-5e-60-c8-9f-36",
        name: "Terence Leung",
        room: "1",
        date: this.inOut(now.setMinutes(now.getMinutes() - 20))
      }
    ]).then((users) => 
    {
      this.macList = users;
    });
  }

  inOut(date) {
    var difference = ((new Date()).valueOf() - date);

    return (difference < 600000 ? "IN" : "OUT")
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
