import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  ViewChild,
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
export class Home implements AfterViewChecked {
  router = inject(Router);
  huggingFace = inject(ChatModel);
  messages: Message[] = [];
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  constructor(private sanitizer: DomSanitizer) {}
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
        console.log("something scrolled")
      }
    } catch (err) {
      console.error('Auto-scroll failed:', err);
    }
  }

  private formatResponse(text: string): SafeHtml {
    if (!text) return '';

    const rawHtml = marked.parse(text) as string; // converts Markdown → HTML
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
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.messages[loadingIndex] = {
          text: '⚠️ Something went wrong',
          sender: 'bot',
          timestamp: new Date(),
        };
        this.scrollToBottom();
      },
    });
  }

  handleLoginOut() {
    this.router.navigate(['login']);
  }
}
