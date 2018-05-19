import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  messages: { content: string, type: string }[];
  private messagesChangedSubscription: Subscription;

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.messages = [];
    this.messagesChangedSubscription = this.messagesService.messagesChanged.subscribe(
      (message: { content: string, type: string }) => {
        this.messages.push(message);
        setTimeout(() => {
          this.messages.splice(this.messages.indexOf(message), 1);
        }, 3000);
      });
  }

  onCloseAlert(index: number) {
    this.messages.splice(index, 1);
  }

  ngOnDestroy() {
    this.messagesChangedSubscription.unsubscribe();
  }

}
