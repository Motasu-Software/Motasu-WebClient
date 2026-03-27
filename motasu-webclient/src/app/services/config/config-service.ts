import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/config.json'))
      .then(config => {
        this.config = config;
      })
      .catch(error => {
        console.error('%c[Config] Failed to load configuration:', 'color: #e74c3c; font-weight: bold;', error);
        return Promise.reject(error);
      }
    );
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }
}