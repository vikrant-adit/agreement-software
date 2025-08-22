import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmDataService,CRMUpdateResponse } from '../../../../services/crm service/crm.service';

@Component({
  selector: 'app-payment-thank-you',
  standalone: true,
  imports: [],
  templateUrl: './payment-thank-you.component.html',
  styleUrl: './payment-thank-you.component.scss'
})
export class PaymentThankYouComponent {
 isLoading = false;
  showFailureMessage = false;
  progressPercentage = 0;
 progress = 0; // Start at 0



  startProgressBar() {
    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 1;
      } else {
        clearInterval(interval);
        // this.router.navigate(['/next-component']); // Change to your route
      }
    }, 30); // Adjust speed as needed
  }
    agreementId: string = '';

  constructor(
    private crmDataService: CrmDataService,
    private router: Router,
    private route: ActivatedRoute

  ) {
        this.startProgressBar();
  }

  ngOnInit(): void {
    // this.updateCRMData();
     this.route.params.subscribe(params => {
      this.agreementId = params['agreementId'];
    });
    // this.getDealData();
  }
  getDealData(){
      console.log('Deal ID:', this.agreementId);
    this.crmDataService.getCRM_Deal_data(this.agreementId).subscribe(data => {
      console.log(data);
    })
  }
  /**
   * Main function to update CRM data - Angular TypeScript version
   */
  updateCRMData(): void {
    const locationId = this.crmDataService.getStorageItem('location_id');
    const agreementId = this.crmDataService.getStorageItem('agreement_id');

    // Check if location_id is empty
    if (!locationId || locationId === '') {
      this.handleFailure(agreementId);
      return;
    }

    
    const csrfToken = this.crmDataService.getCsrfToken();
    this.isLoading = true;

    this.crmDataService.updateCRMData(locationId, agreementId, csrfToken)
      .subscribe({
        next: (response: CRMUpdateResponse) => {
          this.handleSuccess(response, agreementId);
        },
        error: (error:any) => {
          this.handleError(error, agreementId);
        }
      });
  }

  /**
   * Handle successful response
   */
  private handleSuccess(response: CRMUpdateResponse, agreementId: string): void {
    this.isLoading = false;

    // Check if response has no errors (equivalent to $.isEmptyObject(response.error))
    if (!response.error || Object.keys(response.error).length === 0) {
      
      // Split response similar to original logic
      const responseStr = String(response);
      const arr = responseStr.split('||*||');

      if (arr.length > 1) {
        const status = arr[1];

        switch (status) {
          case 'fail':
            this.handleFailure(agreementId);
            break;

          case 'failexisting':
            this.crmDataService.clearStorageData();
            this.router.navigate(['/signup-failed', agreementId]);
            break;

          case 'successexisting':
            this.crmDataService.clearStorageData();
            this.router.navigate(['/existing-signup-thank-you', agreementId]);
            break;

          default:
            // Success case
            this.updateProgress(100);
            this.crmDataService.clearStorageData();
            this.router.navigate(['/user-account-setup', agreementId]);
            break;
        }
      } else {
        // Default success case
        this.updateProgress(100);
        this.crmDataService.clearStorageData();
        this.router.navigate(['/user-account-setup', agreementId]);
      }
    } else {
      this.handleFailure(agreementId);
    }
  }

  /**
   * Handle error response
   */
  private handleError(error: any, agreementId: string): void {
    this.isLoading = false;
    this.handleFailure(agreementId);
  }

  /**
   * Handle failure scenario
   */
  private handleFailure(agreementId: string): void {
    this.isLoading = false;
    this.showFailureMessage = true;

    setTimeout(() => {
      this.crmDataService.clearStorageData();
      this.crmDataService.navigateToExternal(`https://go.adit.com/agreement/${agreementId}`);
    }, 2000);
  }

  /**
   * Update progress bar
   */
  private updateProgress(percentage: number): void {
    this.progressPercentage = percentage;
  }
}