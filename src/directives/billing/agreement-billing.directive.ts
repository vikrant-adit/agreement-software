import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appAgreementBilling]'
})
export class AgreementBillingDirective implements OnInit {
  @Input() agreementId?: string;
  @Input() defaultBillingType: 'monthly' | 'annually' = 'monthly';
  @Input() agreementData: any;
  @Input() multiple_location: string = '';
  @Input() isAnnually: boolean = false;
  pricingArray: any;
  // Current billing selection
  private _billingType: 'monthly' | 'annually';
  
  // Events
  @Output() billingTypeChanged = new EventEmitter<'monthly' | 'annually'>();
  @Output() agreementDataLoaded = new EventEmitter<any>();
  
  constructor() {
    this._billingType = this.defaultBillingType;
  }
  
  ngOnInit() {
    if (this.agreementData) {
      this.agreementDataLoaded.emit(this.agreementData);
      
      // Initialize from data if available
      if (this.agreementData.billingType) {
        this._billingType = this.agreementData.billingType;
        this.billingTypeChanged.emit(this._billingType);
        const includedKeys = [
            'analyticAnnual',
            'techMonthly_Disc',
            'analyticAnnual_Disc',
            'techAnnual',
            'techMonthly',
            'techAnnual_Disc',
            'analyticMonthly',
            'analyticMonthly_Disc',
            'aditLiteMontly',
            'aditLiteMontly_Disc',
            'aditLiteAnnual',
            'aditLiteAnnual_Disc',
            'aditCore_monthly',
            'aditCore_annually',
            'add_on_phones',
            'add_on_analytic',
            'add_on_verification',
            'pozative_Only_Monthly',
            'pozative_Only_Annually',
            'verifications_Only_Monthly',
            'verifications_Only_Annually',
            'hardwareCreditAnnually',
            'hardwareCreditMonthly',
          ];
        this.pricingArray = includedKeys.reduce((acc, key) => {
            if (this.agreementData.hasOwnProperty(key)) {
              acc[key] = this.agreementData[key]; // Add the key-value pair to the object
            }
            return acc;
          }, {} as { [key: string]: any }); // Initialize as an empty object
    
      }
    }
  }
  
  // Getter for billing type
  get billingType(): 'monthly' | 'annually' {
    return this._billingType;
  }
  
  // Setter for billing type
  @Input()
  set billingType(value: 'monthly' | 'annually') {
    if (this._billingType !== value) {
      this._billingType = value;
      this.billingTypeChanged.emit(this._billingType);
    }
  }
  
  // Helper methods for pricing calculations
  getMonthlyValue(monthlyValue: number, annualValue: number): number {
    return this._billingType === 'monthly' ? monthlyValue : annualValue;
  }
  
  // Calculate annual savings percentage
  calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
    if (!monthlyPrice || !annualPrice) return 0;
    const annualEquivalent = monthlyPrice * 12;
    return Math.round(((annualEquivalent - annualPrice) / annualEquivalent) * 100);
  }
  
  // Format currency with optional currency symbol
  formatCurrency(value: number, currencySymbol: string = '$'): string {
    return `${currencySymbol}${value.toFixed(2)}`;
  }
}