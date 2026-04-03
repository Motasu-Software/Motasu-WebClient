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
    await configService.loadConfig();
    userService.initSynchronously();
    await authInitializer.initialize();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: AUTH_STRATEGY, useClass: GraphQLAuthService },
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