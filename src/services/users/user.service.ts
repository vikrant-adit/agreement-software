// user.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
import { mockData } from '../../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUsers(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = ''
  ): Observable<any> {
    if (environment.useMockData) {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ];

      const filteredUsers = searchTerm
        ? mockUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockUsers;

      return of({
        success: true,
        data: filteredUsers,
        total: filteredUsers.length
      });
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', searchTerm);

    return this.http
      .get<any>(this.baseUrl + '/users', { params })
      .pipe(catchError(this.handleError));
  }

  createUser(data: any): Observable<any> {
    if (environment.useMockData) {
      const newUser = {
        id: mockData.users.length + 1,
        ...data,
        status: 'active'
      };
      mockData.users.push(newUser);
      return of(newUser);
    }

    return this.http
      .post<any>(this.baseUrl + '/users', data)
      .pipe(catchError(this.handleError));
  }

  updateUser(id:any,data: any): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/users/'+id, data)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id:any){
    return this.http.delete<any>(this.baseUrl + '/update-user/'+id)
    .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    if (environment.useMockData) {
      const user = mockData.users.find(u => u.email === email && u.password === password);
      if (user) {
        // Generate mock tokens
        const accessToken = 'mock-access-token-' + Date.now();
        const refreshToken = 'mock-refresh-token-' + Date.now();
        
        return of({
          accessToken,
          refreshToken,
          userId: user.id,
          role: user.role,
          permissions: user.permissions,
          message: 'Login successful',
          firstLogin: false
        });
      }
      return throwError(() => 'Invalid email or password');
    }

    return this.http
      .post(`${this.baseUrl}/users/login`, { email, password })
      .pipe(catchError(this.handleError));
  }

  verifyOtp(email: number, otp: string, newPassword: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/verify-otp`, { email, otp, newPassword })
      .pipe(catchError(this.handleError));
  }

  resendOTP(email: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/resend-otp`, { email })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage =
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`;
    }
    // Return an observable with a user-facing error message.
    return throwError(() => errorMessage);
  }

  getUser(id: any): Observable<any> {
    if (environment.useMockData) {
      const user = mockData.users.find(u => u.id === id);
      return user ? of(user) : throwError(() => 'User not found');
    }

    return this.http
      .get<any>(this.baseUrl + '/users/' + id)
      .pipe(catchError(this.handleError));
  }
}
