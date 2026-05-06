import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthStrategy } from './services/auth/auth-strategy.interface';
import { GraphQLAuthService } from './services/auth/graph-qlauth-service';
import { InjectionToken } from '@angular/core';
import { routes } from './app.routes';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient, HTTP_INTERCEPTORS, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import { ConfigService } from './services/config/config-service';
import { AuthInitializerService } from './services/auth/auth-initializer.service';
import { AuthInterceptor } from './guards/auth/auth.interceptor';
import { UserService } from './services/user/user.service';

export const AUTH_STRATEGY = new InjectionToken<AuthStrategy>('AuthStrategy');

export function initializeApp(
  configService: ConfigService,
  userService: UserService,
  authInitializer: AuthInitializerService
) {
  return async () => {
    console.log('🚀 Initializing application...');
    await configService.loadConfig();
    console.log('🚀 Configuration loaded, initializing authentication...');
    userService.initSynchronously();
    console.log('🚀 UserService initialized, verifying authentication...');
    await authInitializer.initialize();
      console.log('🚀 Authentication verification completed, application initialized');
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: AUTH_STRATEGY, useClass: GraphQLAuthService },
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const configService = inject(ConfigService);

    return {
        link: httpLink.create({ 
          uri: () => configService.apiUrl,
          withCredentials: true 
        }),
        cache: new InMemoryCache(),
      };
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, UserService, AuthInitializerService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideRouter(routes)
  ]
};