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
    return this.http.post<any>(environment.baseUrl+'/agreements', formData).pipe(
      catchError(this.handleError)
    );
  }

  updateForm(formData: any,agreementId:any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/agreements/'+agreementId, formData).pipe(
      catchError(this.handleError)
    );
  }
  updateDays(no_of_days: any,agreementId:any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/agreements/'+agreementId, no_of_days).pipe(
      catchError(this.handleError)
    );
  }
  getAgreement(agreementId:any): Observable<any>{
    return this.http.get<any>(this.baseUrl+'/agreements/'+agreementId).pipe(
      catchError(this.handleError)
    );
  }

  add_practice_data(formData: any,id:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/practices-data/add-practice-data/'+id, formData).pipe(
      catchError(this.handleError)
    );
  }

   addBillingData(formData: any,locationId:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/location-shipping-billing/'+locationId, formData).pipe(
      catchError(this.handleError)
    );
  }

  deletePracticeLocation(agreementId: string, locationId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/practices-data/agreements/${agreementId}/practice-data/${locationId}`).pipe(
      catchError(this.handleError)
    );
  }

    addInPersonFormData(formData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/leads/store-lead-data', formData).pipe(
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
    .post(this.baseUrl + '/zoho/check-account' ,{sales_person_account_id:accountId})
    .pipe(catchError(this.handleError));
}
  updateCRMData(locationId: string, agreementId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-crm`, {
      location_id: locationId,
      agreement_id: agreementId
    });
  }
}
