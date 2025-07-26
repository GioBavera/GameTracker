import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private LOGIN_URL = 'http://localhost:8080/api/auth/authenticate';
  private REGISTER_URL = 'http://localhost:8080/api/auth/register';

  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL, {email, password}).pipe(
      tap(response => {
        if(response.token){
          this.setToken(response.token);
        }
      })
    )
  }

  register(firstName: string, email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.REGISTER_URL, { firstName, email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  } 

  public getToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null;
    } catch {
      return null;
    }
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

}