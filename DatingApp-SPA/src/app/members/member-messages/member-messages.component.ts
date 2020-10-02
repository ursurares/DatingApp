import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId:number;
  messages:Message[];
  newMessage: any ={};

  recipientName:string;
  id:number;
  constructor(
    
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    const currentUserID=+this.authService.decodedToken.nameid
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
    .pipe(
      tap(messages => {
        for(let i =0; i<messages.length;i++){
          if(messages[i].isRead == false && messages[i].recipientId === currentUserID)
            this.userService.markAsRead(currentUserID, messages[i].id);
        }
      })
    )
    .subscribe( messages => {
      this.messages=messages;
      
    }, error => {
      this.alertify.error(error);
    });
    this.userService.getUser(this.recipientId).subscribe(recipient => {
      this.recipientName=recipient.knownAs;
    });
  }
  sendMessage(){
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid,this.newMessage).subscribe((message: Message) => {
      /* Solution 1
       message.senderKnownAs=this.authService.currentUser.knownAs;
      message.senderPhotoUrl=this.authService.currentUser.photoUrl; */
      this.messages.unshift(message);
      this.newMessage.content='';
    }, error => {
      this.alertify.error(error);
    })
  }

}
