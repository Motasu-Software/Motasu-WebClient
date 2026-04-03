import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthStrategy } from './services/auth/auth-strategy.interface';
import { GraphQLAuthService } from './services/auth/graph-qlauth-service';
import { InjectionToken } from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import { ConfigService } from './services/config/config-service';
import { AuthInitializerService } from './services/auth-initializer.service';
import { AuthInterceptor } from './auth.interceptor';

export const AUTH_STRATEGY = new InjectionToken<AuthStrategy>('AuthStrategy');

export function initializeApp(configService: ConfigService){
  return () => configService.loadConfig();
}

export function initializeAuth(authInitializerService: AuthInitializerService) {
  return () => authInitializerService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: AUTH_STRATEGY, useClass: GraphQLAuthService},
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: 'http://localhost:4000/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthInitializerService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
