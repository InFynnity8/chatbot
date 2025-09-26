import { inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class ResponseFormatter {
   sanitizer = inject(DomSanitizer)
   
    formatResponse(text: string): SafeHtml {
    if (!text) return '';

    const rawHtml = marked.parse(text) as string;
    return this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
  }
}
