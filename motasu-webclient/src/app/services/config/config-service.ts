import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;
  private pureHttp: HttpClient;

 
  constructor(private handler: HttpBackend) {
    
    this.pureHttp = new HttpClient(this.handler);
  }

  loadConfig(): Promise<void> {
    
    return firstValueFrom(this.pureHttp.get('/config/config.json'))
      .then(config => {
        this.config = config;
        console.log('%c[Config] Configuration loaded successfully:', 'color: #2ecc71; font-weight: bold;', this.config);
      })
      .catch(error => {
        console.error('%c[Config] Failed to load configuration:', 'color: #e74c3c; font-weight: bold;', error);
        return Promise.reject(error);
      });
  }

  getConfig(): any {
    return this.config || {};
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }
}