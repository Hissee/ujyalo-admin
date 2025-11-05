import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoints } from '../const/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(Endpoints.LOGIN, { email, password });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(Endpoints.GET_CURRENT_USER);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

