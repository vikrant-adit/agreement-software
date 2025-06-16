import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';
import { mockData } from '../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // ✅ Refresh access token and update role & permissions
  refreshAccessToken(): Observable<{ accessToken: string; role: string; permissions: string[] }> {
    if (environment.useMockData) {
      // Return a mock token that expires in 1 hour
      const mockToken = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        role: 'admin',
        permissions: ["view_users","add_users","edit_users","delete_users","view_roles","add_roles","edit_roles","delete_roles","view_agreements","add_agreements","edit_agreements","delete_agreements","view_settings","view_permission","edit_permissions","delete_permission","add_permissions","add_admin","assign_permissions"]
      };
      localStorage.setItem('accessToken', mockToken.accessToken);
      localStorage.setItem('role', mockToken.role);
      localStorage.setItem('permissions', JSON.stringify(mockToken.permissions));
      return of(mockToken);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string; role: string; permissions: string[] }>(
      `${this.baseUrl}/users/refresh-token`,
      { refreshToken }
    ).pipe(
      map(response => {
        // Update localStorage with new tokens, role, and permissions
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('role', response.role);
        localStorage.setItem('permissions', JSON.stringify(response.permissions));
        return response;
      })
    );
  }

  getUserPermissions(): string[] {
    if (environment.useMockData) {
      // Return mock permissions for testing
      return ["view_users","add_users","edit_users","delete_users","view_roles","add_roles","edit_roles","delete_roles","view_agreements","add_agreements","edit_agreements","delete_agreements","view_settings","view_permission","edit_permissions","delete_permission","add_permissions","add_admin","assign_permissions"];
    }
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  }
  
  // ✅ Logout function that clears all user-related data
  logout() {
    if (!environment.useMockData) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  }

  hasPermission(permission: string): boolean {
    if (environment.useMockData) {
      return true;
    }
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }
}
