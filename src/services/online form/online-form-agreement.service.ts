import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
import { mockData } from '../../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class OnlineFormAgreementService {
  private baseUrl = environment.baseUrl;
  techStackForm:any
  constructor(private http: HttpClient) {}

  saveTechStackFrom(formData:any){
    console.log(formData,"service")
    this.techStackForm=formData
    console.log(this.techStackForm)
  }

  // Function to submit form data
  saveForm(formData: any): Observable<any> {
    if (environment.useMockData) {
      const newAgreement = {
        id: (mockData.agreements.length + 1).toString(),
        ...formData,
        status: 'pending',
        agreementNumber: `AG-${new Date().getFullYear()}-${String(mockData.agreements.length + 1).padStart(3, '0')}`
      };
      mockData.agreements.push(newAgreement);
      return of(newAgreement);
    }

    return this.http.post<any>(environment.baseUrl + '/agreements', formData).pipe(
      catchError(this.handleError)
    );
  }

  updateForm(formData: any, agreementId: any): Observable<any> {
    if (environment.useMockData) {
      const index = mockData.agreements.findIndex(a => a.id === agreementId);
      if (index !== -1) {
        mockData.agreements[index] = { ...mockData.agreements[index], ...formData };
        return of(mockData.agreements[index]);
      }
      return throwError(() => 'Agreement not found');
    }

    return this.http.put<any>(this.baseUrl + '/agreements/' + agreementId, formData).pipe(
      catchError(this.handleError)
    );
  }

  getAgreement(agreementId: any): Observable<any> {
    if (environment.useMockData) {
      const agreement = mockData.agreements.find(a => a.id === agreementId);
      if (agreement) {
        return of(agreement);
      }
      return throwError(() => 'Agreement not found');
    }

    return this.http.get<any>(this.baseUrl + '/agreements/' + agreementId).pipe(
      catchError(this.handleError)
    );
  }

  add_practice_data(formData: any, id: any): Observable<any> {
    if (environment.useMockData) {
      const agreement = mockData.agreements.find(a => a.id === id);
      if (agreement) {
        agreement.locations = [...(agreement.locations || []), formData];
        return of(agreement);
      }
      return throwError(() => 'Agreement not found');
    }

    return this.http.post<any>(this.baseUrl + '/practices-data/add-practice-data/' + id, formData).pipe(
      catchError(this.handleError)
    );
  }

  deletePracticeLocation(agreementId: string, locationId: string): Observable<any> {
    if (environment.useMockData) {
      const agreement = mockData.agreements.find(a => a.id === agreementId);
      if (agreement && agreement.locations) {
        agreement.locations = agreement.locations.filter((_, index) => index.toString() !== locationId);
        return of(agreement);
      }
      return throwError(() => 'Agreement or location not found');
    }

    return this.http.delete<any>(`${this.baseUrl}/practices-data/agreements/${agreementId}/practice-data/${locationId}`).pipe(
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
    if (environment.useMockData) {
      // Return a mock blob for testing
      return of(new Blob(['Mock sample file content'], { type: 'text/plain' }));
    }

    const url = 'http://localhost:5000/download-sample-file';
    return this.http.get(url, { responseType: 'blob' });
  }

  fetchDeal(accountId: any) {
    if (environment.useMockData) {
      // Return mock deal data
      return of({
        accountName: 'Mock Account',
        dealValue: 50000,
        status: 'active'
      });
    }

    return this.http
      .post(this.baseUrl + '/zoho/check-account', { sales_person_account_id: accountId })
      .pipe(catchError(this.handleError));
  }
}
