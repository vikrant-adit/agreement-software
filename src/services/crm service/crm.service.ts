// crm-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
export interface CRMUpdateRequest {
  _token: string;
  location_id: string;
  agreement_id: string;
}

export interface CRMUpdateResponse {
  error?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CrmDataService {
  private readonly UPDATE_CRM_URL = environment.baseUrl+ '/update-crm-data';
  
  constructor(private http: HttpClient) {}

  /**
   * Updates CRM data
   * @param locationId - Location ID from storage
   * @param agreementId - Agreement ID from storage
   * @param csrfToken - CSRF token from meta tag
   * @returns Observable with the response
   */
  updateCRMData(locationId: string, agreementId: string, csrfToken: string): Observable<CRMUpdateResponse> {
    const requestData: CRMUpdateRequest = {
      _token: csrfToken,
      location_id: locationId,
      agreement_id: agreementId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<CRMUpdateResponse>(this.UPDATE_CRM_URL, requestData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('CRM Data Service Error:', error);
    return throwError(() => error);
  }

  /**
   * Get CSRF token from meta tag
   */
  getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return metaTag?.getAttribute('content') || '';
  }

  /**
   * Get item from localStorage
   */
  getStorageItem(key: string): string {
    return localStorage.getItem(key) || '';
  }

  /**
   * Clear storage data (assuming this is what removeStoragedt() does)
   */
  clearStorageData(): void {
    localStorage.removeItem('location_id');
    localStorage.removeItem('agreement_id');
    // Add other storage items that need to be cleared
  }

  /**
   * Navigate to external URL
   */
  navigateToExternal(url: string): void {
    window.location.href = url;
  }
}