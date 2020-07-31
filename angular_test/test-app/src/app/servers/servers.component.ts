import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = true;
  serverCreationStatus = 'No server was created';
  serverName = '';
  serverCreated = false;
  userName = '';
  servers = ['Testserver', 'Testserver 2'];
  constructor() { }

  ngOnInit(): void {
  }

  onCreateServer(): void{
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server was created. Name is ' + this.serverName;
  }
  userNameCheck(): boolean{
    if (this.userName !== ''){
      return true;
    }else{
      return false;
    }
  }
  onUserReset(): void{
    this.userName = '';
  }


}
