import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // ✅ Refresh access token and update role & permissions
  refreshAccessToken(): Observable<{ accessToken: string; role: string; permissions: string[] }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string; role: string; permissions: string[] }>(
      `${this.baseUrl}/refresh-token`,
      { refreshToken }
    ).pipe(
      map(response => {
        // Update localStorage with new tokens, role, and permissions
        localStorage.setItem('accessToken', response.accessToken);
        // localStorage.setItem('role', response.role);
        // localStorage.setItem('permissions', JSON.stringify(response.permissions));
        return response;
      })
    );
  }

  getUserPermissions(): string[] {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  }
  
  // ✅ Logout function that clears all user-related data
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    localStorage.removeItem('userId');
    window.location.href = '/login'; // Redirect to login page
  }
}
