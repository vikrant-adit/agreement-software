import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventzService {
 private baseUrl=environment.baseUrl+'/eventz';
  constructor(private http: HttpClient) { }

  getEventz(){
     return this.http.get<any>(this.baseUrl).pipe(
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
