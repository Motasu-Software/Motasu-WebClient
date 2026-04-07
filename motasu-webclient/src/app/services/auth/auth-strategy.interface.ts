import { Observable } from "rxjs";
import { User } from "../../model/user.model";

export interface AuthStrategy {
    login(login: string, password: string): Observable<User>
    logout(token: string): Observable<void>;
    verifyToken(): Observable<User>;
    register(username: string, email: string, password: string): Observable<void>;
}