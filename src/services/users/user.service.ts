// user.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', searchTerm);

    return this.http
      .get<any>(this.baseUrl + '/users', { params })
      .pipe(catchError(this.handleError));
  }

  createUser(data: any): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/create-user', data)
      .pipe(catchError(this.handleError));
  }

  updateUser(id:any,data: any): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/update-user/'+id, data)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id:any){
    return this.http.delete<any>(this.baseUrl + '/update-user/'+id)
    .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/login`, { username, password })
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

  getUser(id:any){
    return this.http
    .get<any>(this.baseUrl + '/users/'+id)
    .pipe(catchError(this.handleError));
  }
}
