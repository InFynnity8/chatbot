import { Component, inject, signal } from '@angular/core';
import { ChatBox } from '../../components/chat-box/chat-box';
import { MessageList } from '../../components/message-list/message-list';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChatModel } from '../../services/chat/chat-model';
import { SafeHtml } from '@angular/platform-browser';
import { ResponseFormatter } from '../../services/response-formatter/response-formatter';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();


  router = inject(Router);
  huggingFace = inject(ChatModel);
  messages: Message[] = [];
  username = signal('');
  formatter = inject(ResponseFormatter);

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
      this.messages[index].text = this.formatter.formatResponse(current);
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('credentials');
    if (stored) {
      const credentials: Credentials = JSON.parse(stored);
      this.username.set(credentials.username ?? '');
    }
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
    this.huggingFace.sendMessage(message)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
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
        console.error('Chat error:', err);
        this.messages[loadingIndex] = {
          text: '⚠️ Connection issue. Please try again later.',
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

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
