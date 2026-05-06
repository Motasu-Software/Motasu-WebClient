import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;
  private pureHttp: HttpClient;

  constructor(
    private handler: HttpBackend,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.pureHttp = new HttpClient(this.handler);
  }

  loadConfig(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.config = {
        apiUrl: process.env['API_URL'] || 'http://localhost:4000/'
      };
      return Promise.resolve();
    }

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
    return this.config?.apiUrl || 'http://localhost:4000/';
  }
}