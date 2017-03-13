var Startup = (function () {
    function Startup() {
        var _this = this;
        this.fetchMacList()
            .then(function () { return _this.parseMacList(); })
            .then(function () { return _this.renderUI(); }, function (reason) { return console.log('api failed', reason); });
    }
    Startup.main = function () {
        console.log('Hello World');
        return 0;
    };
    Startup.prototype.fetchMacList = function () {
        //this.macList = this.mockMacList();
        var _this = this;
        var deferred = Q.defer();
        var url = Config.apiUrl + 'users';
        var request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status == 200) {
                _this.macList = JSON.parse(request.response);
                deferred.resolve(_this.macList);
            }
            else {
                deferred.reject(request.status);
            }
        };
        request.open('get', url, true);
        request.send(null);
        return deferred.promise;
    };
    Startup.prototype.parseMacList = function () {
        var _this = this;
        this.macList.forEach(function (userItem) {
            userItem.name = userItem.name ? userItem.name : 'Guest';
            userItem.room = userItem.room ? userItem.room : 'N/A';
            userItem.status = _this.getStatus(userItem.time);
        });
    };
    Startup.prototype.mockMacList = function () {
        return [
            {
                mac: "a4-5e-60-c8-9f-34",
                name: "Ian Phillipchuk",
                room: "1",
                status: this.inOut(new Date(new Date() - 600000))
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
    };
    Startup.prototype.renderUI = function () {
        var list = document.createElement('ul');
        this.macList.forEach(function (userItem) {
            var listItem = document.createElement('li');
            listItem.innerHTML = userItem.name + ': ' + userItem.status;
            list.appendChild(listItem);
        });
        var wrapper = document.getElementById('userListing');
        wrapper.appendChild(list);
    };
    Startup.prototype.getStatus = function (date) {
        var difference = ((new Date()).valueOf() - date);
        return (difference < 600000 ? "IN" : "OUT");
    };
    return Startup;
}());
var UserItem = (function () {
    function UserItem() {
    }
    return UserItem;
}());
var Config = (function () {
    function Config() {
    }
    Config.apiUrl = 'http://192.168.1.72:3010/';
    return Config;
}());
var s = new Startup();
//# sourceMappingURL=index.js.map