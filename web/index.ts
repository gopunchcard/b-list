
class Startup {
    macList: [UserItem];

    public static main(): number {
        console.log('Hello World');
        return 0;        
    }

    constructor(){

        //on first launch get data right away, then every 60 seconds
         this.fetchMacList()
            .then(()=> this.parseMacList())
            .then(()=> this.renderUI(),
            (reason)=> console.log('api failed', reason));

        setInterval(()=> {
            this.fetchMacList()
            .then(()=> this.parseMacList())
            .then(()=> this.renderUI(),
            (reason)=> console.log('api failed', reason));
        }, 60000);
    }

    private fetchMacList(){
        
        if(Config.useMockData){
            this.macList = this.mockMacList();
            return Q.when(this.macList);
        }
        else{
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
                status: this.getStatus(new Date(new Date() as any - 600000)),
                time: new Date(new Date() as any - 600000)
            },
            {
                mac: "a4-5e-60-c8-9f-35",
                name: "Mark Zacharias",
                room: "1",
                status: this.getStatus(new Date()),
                time: new Date()
            },
            {
                mac: "a4-5e-60-c8-9f-36",
                name: "Terence Leung",
                room: "1",
                status: this.getStatus(new Date()),
                time: new Date()
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

        while(wrapper.firstChild){
            wrapper.removeChild(wrapper.firstChild);
        }
        wrapper.appendChild(list);
    }

    private getStatus(date: Date) {
        var difference = ((new Date()).valueOf() - (date as any));
        return (difference < 600000 ? "IN" : "OUT"); //consider user 'out' after 10 minutes
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
    public static apiUrl: string = 'http://10.0.1.9:3010/';
    public static useMockData: boolean = false;
}

var s = new Startup();