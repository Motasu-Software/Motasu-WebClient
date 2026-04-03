import { TestBed } from '@angular/core/testing';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get current user', () => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    service.setUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('should return isLoggedIn true when user is set', () => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    service.setUser(user);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should clear user on logout', () => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    service.setUser(user);
    service.clearUser();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getUser()).toBeNull();
  });

  it('should persist user to localStorage', (done) => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    service.setUser(user);
    
    setTimeout(() => {
      const stored = localStorage.getItem('currentUser');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(user);
      done();
    }, 50);
  });
});
