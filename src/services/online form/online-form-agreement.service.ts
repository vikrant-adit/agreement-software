import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class OnlineFormAgreementService {
  private baseUrl = environment.baseUrl + '/save-form';
  techStackForm:any
  constructor(private http: HttpClient) {}

  saveTechStackFrom(formData:any){
    console.log(formData,"SERVIEC")
    this.techStackForm=formData
    console.log(this.techStackForm)
  }

  // Function to submit form data
  saveForm(formData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
