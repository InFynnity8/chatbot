import { Component, inject, signal } from '@angular/core';
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

interface Credentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-home',
  imports: [ChatBox, MessageList, NgClass, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  router = inject(Router);
  huggingFace = inject(ChatModel);
  messages: Message[] = [];
  username = signal('');

  private startThinkingAnimation(index: number) {
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4; // cycle 0-3
      this.messages[index].text = `Thinking${'.'.repeat(dots)}`;
    }, 500);

    return interval;
  }

  private typeWriterEffect(fullText: string, index: number, speed = 30) {
    let current = '';
    let i = 0;

    const interval = setInterval(() => {
      current += fullText[i];
      this.messages[index].text = this.formatResponse(current);
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);
  }

  constructor(private sanitizer: DomSanitizer) {
    const stored = localStorage.getItem('credentials');
    if (stored) {
      const credentials: Credentials = JSON.parse(stored);
      this.username.set(credentials.username ?? '');
    }
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
        text: 'Thinking',
        sender: 'bot',
        timestamp: new Date(),
      }) - 1;
    const animation = this.startThinkingAnimation(loadingIndex);

    // call API via service
    this.huggingFace.sendMessage(message).subscribe({
      next: (response) => {
        clearInterval(animation);
        this.messages[loadingIndex] = {
          text: '',
          sender: 'bot',
          timestamp: new Date(),
        };
        this.typeWriterEffect(response, loadingIndex, 5);
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
    localStorage.removeItem('credentials');
    this.router.navigate(['login']);
  }
}
