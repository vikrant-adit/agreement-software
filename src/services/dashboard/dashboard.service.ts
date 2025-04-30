import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.baseUrl+ '/agreements';

  constructor(private http: HttpClient) {}

  getAgreements(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    status: string = '',
    start: string = '',
    end: string = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', searchTerm)
      .set('status', status)
      .set('startDate', start)
      .set('endDate', end);

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }
  updateAgreementStatus(agreementId: string, status: string): Observable<any> {
    // const url = `${environment.baseUrl}/update-status/${agreementId}`;
    const body = { status }; // Payload for the request
  
    return this.http.put<any>(this.baseUrl+'/'+agreementId, body).pipe(
      catchError(this.handleError) // Handle errors
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
       return throwError(() => error.error.message);
  }
}