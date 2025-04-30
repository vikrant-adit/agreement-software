import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:5000/api/roles/';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
  }
  getRoleswithPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'roles-with-permissions').pipe(
        catchError(this.handleError)
      );
  }

  
  getRole(id:any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'role/'+id).pipe(
        catchError(this.handleError)
      );
  }
  

  addRole(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name }).pipe(
        catchError(this.handleError)
      );
  }

  updateRole(id: number, name: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}`, { name }).pipe(
        catchError(this.handleError)
      );
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-role/${id}`).pipe(
        catchError(this.handleError)
      );
  }

   private handleError(error: HttpErrorResponse) {
          let errorMessage = 'Something bad happened; please try again later.'
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage ='An error occurred:'+error.error.message
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            errorMessage =
              `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
            
          }
          // Return an observable with a user-facing error message.
             return throwError(() => errorMessage);
        }
  
}
