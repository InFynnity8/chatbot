import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { ChatBox } from '../../components/chat-box/chat-box';
import { MessageList } from '../../components/message-list/message-list';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChatModel } from '../../services/chat-model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

interface Message {
  text: string | SafeHtml;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  imports: [ChatBox, MessageList, NgClass, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home  {
  router = inject(Router);
  huggingFace = inject(ChatModel);
  messages: Message[] = [];
  username = signal('')

  constructor(private sanitizer: DomSanitizer) {
    let credentials = JSON.parse(localStorage.getItem('credentials')!)
    this.username.set(credentials.username)
  }
  
  private formatResponse(text: string): SafeHtml {
    if (!text) return '';

    const rawHtml = marked.parse(text) as string; 
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  onSendMessage(message: string) {
    // push user message
    this.messages.push({
      text: message,
      sender: 'user',
      timestamp: new Date(),
    });

    const loadingIndex =
      this.messages.push({
        text: '🤖 Thinking...',
        sender: 'bot',
        timestamp: new Date(),
      }) - 1;

    // call API via service
    this.huggingFace.sendMessage(message).subscribe({
      next: (response) => {
        this.messages[loadingIndex] = {
          text: this.formatResponse(response),
          sender: 'bot',
          timestamp: new Date(),
        };
      },
      error: (err) => {
        console.error(err);
        this.messages[loadingIndex] = {
          text: '⚠️ Something went wrong',
          sender: 'bot',
          timestamp: new Date(),
        };
      },
    });
  }

  handleLoginOut() {
    localStorage.removeItem('credentials')
    this.router.navigate(['login']);
  }
}
