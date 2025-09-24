import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-box',
  imports: [FormsModule, MatIconModule],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
})
export class ChatBox {
  message: string = '';

  @ViewChild('chatInput') chatInput!: ElementRef<HTMLTextAreaElement>;
  @Output() send = new EventEmitter<string>();

  sendMessage() {
    if (this.message.trim()) {
      this.send.emit(this.message);
      this.message = '';
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
      this.autoResize()
    }
  }

  autoResize() {
    const textarea = this.chatInput.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
