
class Startup {
    macList: [UserItem];

    public static main(): number {
        console.log('Hello World');
        return 0;        
    }

    constructor(){

        //on first launch get data right away, then every x seconds
         this.fetchMacList()
            .then(()=> this.parseMacList())
            .then(()=> this.renderUI(),
            (reason)=> console.log('api failed', reason));

        setInterval(()=> {
            this.fetchMacList()
            .then(()=> this.parseMacList())
            .then(()=> this.renderUI(),
            (reason)=> console.log('api failed', reason));
        }, Config.dataRefreshRate);
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
            userItem.company = userItem.company ? userItem.company : '';
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
                company: 'Punchcard Systems',
                status: this.getStatus(new Date(new Date() as any - 600000)),
                time: new Date(new Date() as any - 600000)
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
    }

    private renderUI(){
        var wrapper = document.getElementById('userListing');

        while(wrapper.firstChild){
            wrapper.removeChild(wrapper.firstChild);
        }

        wrapper.appendChild(this.renderTableHeader());
        this.macList.forEach(user => {
            wrapper.appendChild(this.renderUserRow(user));
        });
    }

    private renderTableHeader(){
        let header = document.createElement('div');
        header.className = 'table-header';
        header.innerHTML = '<div class="name"><p>NAME</p></div> <div class="company"><p>COMPANY</p></div> <div class="in"><p>IN</p></div> <div class="out"><p>OUT</p></div>';

        return header;
        
        // <div class="table-header">
        //         <div class="name"><p>NAME</p></div>
        //         <div class="company"><p>COMPANY</p></div>
        //         <div class="in"><p>IN</p></div>
        //         <div class="out"><p>OUT</p></div>
        //     </div>
    }
    private renderUserRow(user:UserItem){
        let row = document.createElement('div');
        row.className = 'table-row';
        
        let html = '<div class="name"><p>' + user.name + '</p></div>';
        html += '<div class="company"><p>' + user.company + '</p></div>';
        if(user.status === 'IN'){
            html += '<div class="in"><div class="active"></div></div>';
            html += '<div class="out"></div>';
        }
        else{
            html += '<div class="in"></div>';
            html += '<div class="out"><div class="active"></div></div>';
        }

        row.innerHTML = html;

        return row;
    }

    private getStatus(date: Date) {
        var difference = ((new Date()).valueOf() - (date as any));
        return (difference < Config.inOutDiff ? "IN" : "OUT"); //consider user 'out' after 1 minutes
    }
}

class UserItem{
    mac: string;
    name: string;
    room: string;
    company: string;
    status: string;
    time: Date;
}

class Config{
    public static apiUrl: string = 'http://10.0.1.9:3010/';
    public static useMockData: boolean = false;
    public static inOutDiff: number = 60000; //consider user 'out' after 1 minutes
    public static dataRefreshRate: number = 30000;  //check every minute
}

var s = new Startup();