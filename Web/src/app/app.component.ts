import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import * as signalR from '@aspnet/signalr';
import { environment } from '../environments/environment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'chat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: signalR.HubConnection = null;
  private name = "";

  public messages = new Array<MessageModel>();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    setTimeout(() => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '600px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.name = result;
      });
    });

    this.http
      .get<SignalRConnectionInfo>(environment.apiUrl + 'getconnection')
      .subscribe(info => {
        let options = {
          accessTokenFactory: () => info.accessToken
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(info.url, options)
          .configureLogging(signalR.LogLevel.Information)
          .build();

        this.hubConnection.start().catch(err => console.error(err.toString()));

        this.hubConnection.on('notify', (message: any, owner: string) => {
          this.messages.push(new MessageModel(message, owner));
        });
      });
  }

  send(message: string): void {
    this.http
      .post(`${environment.apiUrl}sendmessage`, { Message: message, Owner: this.name })
      .subscribe();
  }
}

export class SignalRConnectionInfo {
  url: string;
  accessToken: string;
}

export class MessageModel {
  constructor(
    public message: string,
    public owner: string
  ) {}
}
