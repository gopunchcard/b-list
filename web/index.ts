
class Startup {
    macList: [UserItem];

    public static main(): number {
        console.log('Hello World');
        return 0;        
    }

    constructor(){
        this.fetchMacList()
        .then(()=> this.parseMacList())
        .then(()=> this.renderUI(),
        (reason)=> console.log('api failed', reason));
    }

    private fetchMacList(){
        //this.macList = this.mockMacList();

        var deferred = Q.defer();

        let url  = Config.apiUrl + 'users';
        let request = new XMLHttpRequest();
        request.onload =  () => {
            if(request.status == 200){
                this.macList = JSON.parse(request.response);
                deferred.resolve(this.macList);                
            }
            else{
                deferred.reject(request.status);
            }
        }
        request.open('get', url, true);
        request.send(null);

        return deferred.promise;
    }
    private parseMacList(){
        this.macList.forEach(userItem => {
            userItem.name = userItem.name ? userItem.name : 'Guest';
            userItem.room = userItem.room ? userItem.room : 'N/A';
            userItem.time = new Date(userItem.time);
            userItem.status = this.getStatus(userItem.time);
        });
    }

    private mockMacList(): [UserItem] {
        return [
            {
                mac: "a4-5e-60-c8-9f-34",
                name: "Ian Phillipchuk",
                room: "1",
                status: this.inOut(new Date(new Date() as any - 600000))
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
    }

    private renderUI(){
        var list = document.createElement('ul');

        this.macList.forEach(userItem => {
            let listItem = document.createElement('li');
            listItem.innerHTML = userItem.name + ': ' + userItem.status;
            list.appendChild(listItem);
        });

        var wrapper = document.getElementById('userListing');
        wrapper.appendChild(list);
    }

    private getStatus(date: Date) {
        var difference = ((new Date()).valueOf() - (date as any));
        return (difference < 600000 ? "IN" : "OUT");
    }
}

class UserItem{
    mac: string;
    name: string;
    room: string;
    status: string;
    time: Date;
}

class Config{
    public static apiUrl: string = 'http://192.168.1.72:3010/';
}

var s = new Startup();