import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment';
import { mockData } from '../../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        data: mockData.roles
      });
    }
    return this.http.get(this.apiUrl);
  }

  getRolesWithPermissions(): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        data: {
          roles: mockData.roles,
          rolesList: mockData.roles,
          allPermissions: mockData.permissions
        }
      });
    }
    return this.http.get(`${this.apiUrl}/with-permissions`);
  }

  addRole(name: string): Observable<any> {
    if (environment.useMockData) {
      const newRole = {
        id: mockData.roles.length + 1,
        name: name,
        description: `Role for ${name}`
      };
      mockData.roles.push(newRole);
      return of({
        success: true,
        data: newRole
      });
    }
    return this.http.post(this.apiUrl, { name });
  }

  updateRole(id: number, name: string): Observable<any> {
    if (environment.useMockData) {
      const roleIndex = mockData.roles.findIndex(role => role.id === id);
      if (roleIndex !== -1) {
        mockData.roles[roleIndex] = {
          ...mockData.roles[roleIndex],
          name: name
        };
        return of({
          success: true,
          data: mockData.roles[roleIndex]
        });
      }
    }
    return this.http.put(`${this.apiUrl}/${id}`, { name });
  }

  deleteRole(id: number): Observable<any> {
    if (environment.useMockData) {
      const roleIndex = mockData.roles.findIndex(role => role.id === id);
      if (roleIndex !== -1) {
        mockData.roles.splice(roleIndex, 1);
        return of({
          success: true,
          message: 'Role deleted successfully'
        });
      }
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRolePermissions(roleId: number): Observable<any> {
    if (environment.useMockData) {
      const role = mockData.roles.find(r => r.id === roleId);
      const permissions = mockData.permissions;
      return of({
        success: true,
        data: {
          role,
          permissions,
          assignedPermissions: role ? mockData.users.find(u => u.role === role.name)?.permissions || [] : []
        }
      });
    }
    return this.http.get(`${this.apiUrl}/${roleId}/permissions`);
  }

  assignPermissions(roleId: number, permissions: string[]): Observable<any> {
    if (environment.useMockData) {
      const role = mockData.roles.find(r => r.id === roleId);
      if (role) {
        const user = mockData.users.find(u => u.role === role.name);
        if (user) {
          user.permissions = permissions;
        }
        return of({
          success: true,
          message: 'Permissions assigned successfully'
        });
      }
    }
    return this.http.post(`${this.apiUrl}/${roleId}/permissions`, { permissions });
  }
}
