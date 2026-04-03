import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthFacade } from '../auth.facade';
import { GraphQLAuthService } from './graph-qlauth-service';
import { UserService } from '../user/user.service';
import { JwtService } from './jwt.service';
import { of, throwError } from 'rxjs';
import { User } from '../../model/user.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let mockAuthService: jasmine.SpyObj<GraphQLAuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockJwtService: jasmine.SpyObj<JwtService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser'
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('GraphQLAuthService', ['login']);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'setUser',
      'clearUser',
      'isLoggedIn',
      'getUser',
      'getToken'
    ]);
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', [
      'isTokenValid',
      'getTimeUntilExpiry'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: GraphQLAuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    mockAuthService = TestBed.inject(GraphQLAuthService) as jasmine.SpyObj<GraphQLAuthService>;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockJwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('login', () => {
    it('should call authService.login and return user', (done) => {
      mockAuthService.login.and.returnValue(of(mockUser));

      facade.login('test@example.com', 'password123').subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
          done();
        }
      });
    });

    it('should handle login error', (done) => {
      const error = new Error('Login failed');
      mockAuthService.login.and.returnValue(throwError(() => error));

      facade.login('test@example.com', 'password123').subscribe({
        error: (err) => {
          expect(err).toBeDefined();
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should clear user and navigate to auth', () => {
      facade.logout();
      expect(mockUserService.clearUser).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });

  describe('isTokenValid', () => {
    it('should return true if token is valid', () => {
      mockUserService.getToken.and.returnValue('valid-token');
      mockJwtService.isTokenValid.and.returnValue(true);

      expect(facade.isTokenValid()).toBe(true);
    });

    it('should return false if no token', () => {
      mockUserService.getToken.and.returnValue(null);

      expect(facade.isTokenValid()).toBe(false);
    });
  });

  describe('getTimeUntilTokenExpiry', () => {
    it('should return expiry time', () => {
      mockUserService.getToken.and.returnValue('valid-token');
      mockJwtService.getTimeUntilExpiry.and.returnValue(3600);

      expect(facade.getTimeUntilTokenExpiry()).toBe(3600);
    });

    it('should return null if no token', () => {
      mockUserService.getToken.and.returnValue(null);

      expect(facade.getTimeUntilTokenExpiry()).toBeNull();
    });
  });
});
