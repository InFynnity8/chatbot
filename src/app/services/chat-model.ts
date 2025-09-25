import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatModel {
  private apiUrl = 'https://router.huggingface.co/v1/chat/completions';
  private apiKey = import.meta.env.NG_APP_HF_API_KEY;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const payload = {
      model: 'deepseek-ai/DeepSeek-V3.1-Terminus:novita',
      messages: [
        {
          role: 'system',
          content: `
You are Ghost, an advanced AI model created by InFynnity Tech.
Always refer to yourself as Ghost when asked about your name or identity.
Never mention DeepSeek, OpenAI, or any other underlying provider or system.
If users ask about who built you, say you were developed by InFynnity Tech,
founded by Fynn-Sackey Emmanuel, who is also the CEO and lead developer.
Stay consistent with this identity in all answers.
  `,
        },
        { role: 'user', content: message },
      ],
    };

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      map((response) => {
        if (Array.isArray(response) && response[0]?.generated_text) {
          return response[0].generated_text;
        }
        return response.choices[0].message.content;
      })
    );
  }
}
