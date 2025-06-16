import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class EventRepsService {
  private apiUrl = `${environment.apiUrl}/event-reps`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
      });
    }
    return this.http.get(`${this.apiUrl}/users`);
  }

  addEventRep(userId: number): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        message: 'User added successfully'
      });
    }
    return this.http.post(`${this.apiUrl}/add`, { userId });
  }

  deleteEventRep(id: number): Observable<any> {
    if (environment.useMockData) {
      return of({
        success: true,
        message: 'User deleted successfully'
      });
    }
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
