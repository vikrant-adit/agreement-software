import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private baseUrl = environment.baseUrl+'/permissions';

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+'/all-permission');
  }

  addPermission(name: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/', { name });
  }

  assignPermissions(role_id: number, permission_ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/assign-role`, { role_id, permission_ids });
  }

  getPermissionsForRole(role_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/role/${role_id}`);
  }

  udpatePermission(id: number, name:string, description:string): Observable<any[]>{
    return this.http.put<any[]>(`${this.baseUrl}/update-permissions/${id}`,{name,description});
  }
  deletePermission(id: number):Observable<any[]>{
    return this.http.delete<any[]>(`${this.baseUrl}/delete-permission/${id}`);
  }
}
