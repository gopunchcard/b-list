'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './main.routes';

export class MainComponent {
  macList: [any];

  /*@ngInject*/
  constructor($http : ng.IHttpService, $q : ng.IQService) {
    this.macList = [
    {
      mac: "a4-5e-60-c8-9f-34",
      name: "Ian Phillipchuk",
      room: "1",
      status: this.inOut(new Date())
    }, 
    {
      mac: "a4-5e-60-c8-9f-35",
      name: "Mark Zacharias",
      room: "1",
      status: this.inOut(new Date())
    },
    {
      mac: "a4-5e-60-c8-9f-36",
      name: "Terence Leung",
      room: "1",
      status: this.inOut(new Date())
    }
  ];

    setInterval(() =>
    {
      this.pollApis($q, $http);
    }, 500);
  }
  
  pollApis($q, $http) {
    console.log("Polling!");
    var now = new Date();

    $http.get("http://10.0.1.184:3010/users")
      .then((users) => {
        var newList : any[] = [];

        for (let macEntry of users.data)
        {
          var newEntry = {
            name: macEntry.name ? macEntry.name : "Guest",
            mac: macEntry.mac,
            room: macEntry.room ? macEntry.room : "N/A",
            status: this.inOut(new Date(macEntry.time))
          };

          newList.push(newEntry);
        }

        this.macList = newList;
      });
  }

  inOut(date) {
    var difference = ((new Date()).valueOf() - date);
    return (difference < 600000 ? "IN" : "OUT");
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
