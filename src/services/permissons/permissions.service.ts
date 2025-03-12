import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+'/all-permission');
  }

  addPermission(name: string, description: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/add-permission', { name, description });
  }

  assignPermissions(role_id: number, permission_ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/assign-permission`, { role_id, permission_ids });
  }

  getPermissionsForRole(role_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/role-permission/${role_id}`);
  }
}
