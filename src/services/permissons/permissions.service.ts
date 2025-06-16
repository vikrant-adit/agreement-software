import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment';
import { mockData } from '../../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        data: mockData.permissions
      });
    }
    return this.http.get(this.apiUrl);
  }

  getPermissionsForRole(roleId: number): Observable<any> {
    if (environment.useMockData) {
      const role = mockData.roles.find(r => r.id === roleId);
      const user = role ? mockData.users.find(u => u.role === role.name) : null;
      const assignedPermissions = user ? user.permissions : [];
      
      return of({
        success: true,
        data: {
          role,
          permissions: mockData.permissions,
          assignedPermissions: assignedPermissions
        }
      });
    }
    return this.http.get(`${this.apiUrl}/role/${roleId}`);
  }

  addPermission(name: string, description: string = ''): Observable<any> {
    if (environment.useMockData) {
      const newPermission = {
        id: mockData.permissions.length + 1,
        name: name,
        description: description || `Permission for ${name}`
      };
      mockData.permissions.push(newPermission);
      return of({
        success: true,
        data: newPermission
      });
    }
    return this.http.post(this.apiUrl, { name, description });
  }

  udpatePermission(id: number, name: string, description: string): Observable<any> {
    if (environment.useMockData) {
      const permissionIndex = mockData.permissions.findIndex(p => p.id === id);
      if (permissionIndex !== -1) {
        mockData.permissions[permissionIndex] = {
          ...mockData.permissions[permissionIndex],
          name: name,
          description: description
        };
        return of({
          success: true,
          data: mockData.permissions[permissionIndex]
        });
      }
    }
    return this.http.put(`${this.apiUrl}/${id}`, { name, description });
  }

  deletePermission(id: number): Observable<any> {
    if (environment.useMockData) {
      const permissionIndex = mockData.permissions.findIndex(p => p.id === id);
      if (permissionIndex !== -1) {
        mockData.permissions.splice(permissionIndex, 1);
        return of({
          success: true,
          message: 'Permission deleted successfully'
        });
      }
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  assignPermissions(roleId: number, permissionIds: number[]): Observable<any> {
    if (environment.useMockData) {
      const role = mockData.roles.find(r => r.id === roleId);
      if (role) {
        const permissions = mockData.permissions
          .filter(p => permissionIds.includes(p.id))
          .map(p => p.name);
        
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
    return this.http.post(`${this.apiUrl}/assign`, { roleId, permissionIds });
  }

  getUserPermissions(): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        data: mockData.users[0].permissions
      });
    }
    return this.http.get(`${this.apiUrl}/user`);
  }
}
