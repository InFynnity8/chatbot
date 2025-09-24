import { Component, inject } from '@angular/core';
import { ChatBox } from '../../components/chat-box/chat-box';
import { MessageList } from '../../components/message-list/message-list';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  imports: [ChatBox, MessageList, NgClass, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  router = inject(Router);

  messages: Message[] = [];

  onSendMessage(message: string) {
    this.messages.push({
      text: message,
      sender: 'user',
      timestamp: new Date(),
    });
    // Simulate bot response
    setTimeout(() => {
      this.messages.push({
        text: `You said: ${message}`,
        sender: 'bot',
        timestamp: new Date(),
      });
    }, 500);
  }

  handleLoginOut() {
    this.router.navigate(['login']);
  }
}
