import { Observable } from "rxjs";

export interface AuthStrategy {
    login(login: string, password: string): void
    logout(token: string): Observable<void>;
    isAuthenticated(token: string): Observable<boolean>;
    register(username: string, email: string, password: string): Observable<void>;
}