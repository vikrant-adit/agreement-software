import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class OnlineFormAgreementService {
  private baseUrl = environment.baseUrl ;
  techStackForm:any
  constructor(private http: HttpClient) {}

  saveTechStackFrom(formData:any){
    console.log(formData,"service")
    this.techStackForm=formData
    console.log(this.techStackForm)
  }

  // Function to submit form data
  saveForm(formData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/save-form', formData).pipe(
      catchError(this.handleError)
    );
  }

  updateForm(formData: any,agreementId:any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/update-form/'+agreementId, formData).pipe(
      catchError(this.handleError)
    );
  }

  getAgreement(agreementId:any): Observable<any>{
    return this.http.get<any>(this.baseUrl+'/get-form/'+agreementId).pipe(
      catchError(this.handleError)
    );
  }

  add_practice_data(formData: any,id:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/add-practice-data/'+id, formData).pipe(
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


downloadSampleFile(): Observable<Blob> {
  const url = 'http://localhost:5000/download-sample-file'; // Corrected URL
  return this.http.get(url, { responseType: 'blob' });
}
fetchDeal(accountId:any){
  return this.http
    .get<any>(this.baseUrl + '/fetch-deal/' + accountId)
    .pipe(catchError(this.handleError));
}
}
