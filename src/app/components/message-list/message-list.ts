import { DatePipe } from '@angular/common';
import { Component, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-message-list',
  imports: [DatePipe],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss'
})
export class MessageList implements AfterViewChecked {
 @Input() messages: any[] = [];
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
