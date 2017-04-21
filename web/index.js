var Startup = (function () {
    function Startup() {
        var _this = this;
        //on first launch get data right away, then every x seconds
        this.fetchMacList()
            .then(function () { return _this.parseMacList(); })
            .then(function () { return _this.renderUI(); }, function (reason) { return console.log('api failed', reason); });
        setInterval(function () {
            _this.fetchMacList()
                .then(function () { return _this.parseMacList(); })
                .then(function () { return _this.renderUI(); }, function (reason) { return console.log('api failed', reason); });
        }, Config.dataRefreshRate);
    }
    Startup.main = function () {
        console.log('Hello World');
        return 0;
    };
    Startup.prototype.fetchMacList = function () {
        var _this = this;
        if (Config.useMockData) {
            this.macList = this.mockMacList();
            return Q.when(this.macList);
        }
        else {
            var deferred = Q.defer();
            var url = Config.apiUrl + 'users';
            var request_1 = new XMLHttpRequest();
            request_1.onload = function () {
                if (request_1.status == 200) {
                    _this.macList = JSON.parse(request_1.response);
                    deferred.resolve(_this.macList);
                }
                else {
                    deferred.reject(request_1.status);
                }
            };
            request_1.open('get', url, true);
            request_1.send(null);
            return deferred.promise;
        }
    };
    Startup.prototype.parseMacList = function () {
        var _this = this;
        this.macList.forEach(function (userItem) {
            userItem.name = userItem.name ? userItem.name : 'Guest';
            userItem.room = userItem.room ? userItem.room : 'N/A';
            userItem.company = userItem.company ? userItem.company : '';
            userItem.time = new Date(userItem.time);
            userItem.status = _this.getStatus(userItem.time);
        });
    };
    Startup.prototype.mockMacList = function () {
        return [
            {
                mac: "a4-5e-60-c8-9f-34",
                name: "Ian Phillipchuk",
                room: "1",
                company: 'Punchcard Systems',
                status: this.getStatus(new Date(new Date() - 600000)),
                time: new Date(new Date() - 600000)
            },
            {
                mac: "a4-5e-60-c8-9f-35",
                name: "Mark Zacharias",
                room: "1",
                company: 'Punchcard Systems',
                status: this.getStatus(new Date()),
                time: new Date()
            },
            {
                mac: "a4-5e-60-c8-9f-36",
                name: "Terence Leung",
                room: "1",
                company: 'Punchcard Systems',
                status: this.getStatus(new Date()),
                time: new Date()
            }
        ];
    };
    Startup.prototype.renderUI = function () {
        var _this = this;
        var wrapper = document.getElementById('userListing');
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        wrapper.appendChild(this.renderTableHeader());
        this.macList.forEach(function (user) {
            wrapper.appendChild(_this.renderUserRow(user));
        });
    };
    Startup.prototype.renderTableHeader = function () {
        var header = document.createElement('div');
        header.className = 'table-header';
        header.innerHTML = '<div class="name"><p>NAME</p></div> <div class="company"><p>COMPANY</p></div> <div class="in"><p>IN</p></div> <div class="out"><p>OUT</p></div>';
        return header;
        // <div class="table-header">
        //         <div class="name"><p>NAME</p></div>
        //         <div class="company"><p>COMPANY</p></div>
        //         <div class="in"><p>IN</p></div>
        //         <div class="out"><p>OUT</p></div>
        //     </div>
    };
    Startup.prototype.renderUserRow = function (user) {
        var row = document.createElement('div');
        row.className = 'table-row';
        var html = '<div class="name"><p>' + user.name + '</p></div>';
        html += '<div class="company"><p>' + user.company + '</p></div>';
        if (user.status === 'IN') {
            html += '<div class="in"><div class="active"></div></div>';
            html += '<div class="out"></div>';
        }
        else {
            html += '<div class="in"></div>';
            html += '<div class="out"><div class="active"></div></div>';
        }
        row.innerHTML = html;
        return row;
    };
    Startup.prototype.getStatus = function (date) {
        var difference = ((new Date()).valueOf() - date);
        return (difference < Config.inOutDiff ? "IN" : "OUT"); //consider user 'out' after 1 minutes
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
    return Config;
}());
Config.apiUrl = 'http://10.0.1.9:3010/';
Config.useMockData = false;
Config.inOutDiff = 60000; //consider user 'out' after 1 minutes
Config.dataRefreshRate = 30000; //check every minute
var s = new Startup();
//# sourceMappingURL=index.js.map