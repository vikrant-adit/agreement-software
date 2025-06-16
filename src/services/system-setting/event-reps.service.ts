import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class EventRepsService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.baseUrl+'/settings/sales-reps/list') .pipe(catchError(this.handleError));
  }

  deleteEventRep(id: number): Observable<any> {
    return this.http.delete(this.baseUrl+'/settings/sales-reps/'+id);
  }

  
  addEventRep(userId: number): Observable<any> {
    return this.http.post(this.baseUrl+'/settings/sales-reps/add', { userId: userId });
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
}
