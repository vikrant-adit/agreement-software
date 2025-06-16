import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
import { mockData } from '../../assets/mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.baseUrl + '/agreements';

  constructor(private http: HttpClient) {}

  getAgreements(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    status: string = '',
    start: string = '',
    end: string = ''
  ): Observable<any> {
    if (environment.useMockData) {
      // Filter agreements based on search term and status
      let filteredAgreements = mockData.agreements;
      
      if (searchTerm) {
        filteredAgreements = filteredAgreements.filter(agreement =>
          agreement.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agreement.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agreement.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (status) {
        filteredAgreements = filteredAgreements.filter(agreement =>
          agreement.status.toLowerCase() === status.toLowerCase()
        );
      }

      if (start) {
        filteredAgreements = filteredAgreements.filter(agreement =>
          new Date(agreement.startDate) >= new Date(start)
        );
      }

      if (end) {
        filteredAgreements = filteredAgreements.filter(agreement =>
          new Date(agreement.endDate) <= new Date(end)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAgreements = filteredAgreements.slice(startIndex, endIndex);

      // Transform mock data to match the expected structure
      const transformedAgreements = paginatedAgreements.map(agreement => ({
        created_at: agreement.startDate,
        sales_person_account_name: agreement.companyName,
        sales_person_name: agreement.contactPerson,
        newOrExistingClient: 'New',
        multipleLocations: 'No',
        display_pricing: 'Yes',
        display_techstack: 'Yes',
        sales_person_promotion_type: 'AIDA Member',
        sales_person_client: agreement.companyName,
        sales_person_email: agreement.email,
        user_type: 'Standard',
        activation_fee: 100,
        techMonthly: 500,
        techMonthly_Disc: 450,
        analyticMonthly: 300,
        analyticMonthly_Disc: 270,
        techAnnual: 5000,
        techAnnual_Disc: 4500,
        analyticAnnual: 3000,
        analyticAnnual_Disc: 2700,
        aditLiteMontly: 200,
        aditLiteMontly_Disc: 180,
        aditLiteAnnual: 2000,
        aditLiteAnnual_Disc: 1800,
        aditCore_monthly: 400,
        aditCore_annually: 4000,
        status: agreement.status,
        id: agreement.id
      }));

      return of({
        data: transformedAgreements,
        pagination: {
          total: filteredAgreements.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(filteredAgreements.length / limit)
        }
      });
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', searchTerm)
      .set('status', status)
      .set('startDate', start)
      .set('endDate', end)
      .set('ngrok-skip-browser-warning', '1');

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  updateAgreementStatus(agreementId: string, status: string): Observable<any> {
    if (environment.useMockData) {
      const agreement = mockData.agreements.find(a => a.id === agreementId);
      if (agreement) {
        agreement.status = status;
        return of(agreement);
      }
      return throwError(() => 'Agreement not found');
    }

    const body = { status };
    return this.http.put<any>(this.baseUrl + '/' + agreementId, body).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.'
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An error occurred:' + error.error.message
    } else {
      errorMessage =
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
    }
    return throwError(() => error.error.message);
  }
}