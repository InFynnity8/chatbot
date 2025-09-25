import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
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
        { role: 'user', content: message }
      ]
    };

    return this.http.post<any>(this.apiUrl, payload, { headers })
      .pipe(
        map(response => {
          if (Array.isArray(response) && response[0]?.generated_text) {
            return response[0].generated_text;
          }
          return response.choices[0].message.content;

        })
      );
  }
}