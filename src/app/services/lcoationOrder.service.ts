import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface PaymentData {
  _token: string;
  location_id: string;
  agreement_id: string;
  billing_same: number;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  card_holder_name: string;
  card_issuer: string;
  card_number: string;
  expiration_date: string;
  security_code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentDataService {

  private currentYear: number = new Date().getFullYear();
  private currentMonth: number = new Date().getMonth() + 1;

  constructor() {}

  /**
   * Prepares payment data for API submission
   * @param paymentForm - Angular FormGroup containing payment form data
   * @param billingAddressCheck - Boolean indicating if billing address is same as shipping
   * @param csrfToken - CSRF token for security
   * @returns PaymentData object or null if validation fails
   */
  preparePaymentData(
    paymentForm: FormGroup, 
    billingAddressCheck: boolean, 
    csrfToken: string
  ): PaymentData | null {
    
    const formValue = paymentForm.value;
    
    // Collect form data
    const location_id = formValue.location_id || '';
    const agreement_id = formValue.agreement_id || '';
    const card_holder_name = formValue.card_holder_name || '';
    const card_number = formValue.card_number || '';
    const expiration_date = formValue.expiration_date || '';
    const security_code = formValue.security_code || '';
    const card_issuer = formValue.card_issuer || '';
    
    const billing_address_line1 = formValue.billing_address_line1 || '';
    const billing_address_line2 = formValue.billing_address_line2 || '';
    const billing_city = formValue.billing_city || '';
    const billing_state = formValue.billing_state || '';
    const billing_zip = formValue.billing_zip || '';
    const billing_country = formValue.billing_country || '';
    const billing_same = billingAddressCheck ? 1 : 0;
    
    // Validate data
    const validationResult = this.validatePaymentData(
      card_holder_name,
      card_number,
      expiration_date,
      security_code,
      billing_address_line1,
      billing_city,
      billing_state,
      billing_zip,
      billing_country,
      billingAddressCheck
    );
    
    if (!validationResult.isValid) {
      console.error('Validation failed:', validationResult.errors);
      return null;
    }
    
    // Security check for script injection
    if (!this.performSecurityCheck(
      billing_address_line1,
      billing_address_line2,
      billing_city,
      billing_state,
      billing_zip,
      billing_country
    )) {
      console.error('Security check failed');
      return null;
    }
    
    // Prepare API data
    const apiData: PaymentData = {
      _token: csrfToken,
      location_id,
      agreement_id,
      billing_same,
      billing_address_line1,
      billing_address_line2,
      billing_city,
      billing_state,
      billing_zip,
      billing_country,
      card_holder_name,
      card_issuer,
      card_number,
      expiration_date,
      security_code
    };
    
    return apiData;
  }

  /**
   * Validates payment form data
   */
  private validatePaymentData(
    cardHolderName: string,
    cardNumber: string,
    expirationDate: string,
    securityCode: string,
    billingAddressLine1: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    billingAddressCheck: boolean
  ): ValidationResult {
    
    const errors: { [key: string]: string } = {};
    
    // Card holder name validation
    if (!cardHolderName || cardHolderName.trim() === '') {
      errors['card_holder_name'] = 'Enter the Card Holder Name';
    } else if (cardHolderName.replace(/\s/g, '').length < 2) {
      errors['card_holder_name'] = 'Enter a valid Card Holder Name';
    }
    
    // Card number validation
    if (!cardNumber || cardNumber.trim() === '') {
      errors['card_number'] = 'Enter the Card Number';
    }
    
    // Expiration date validation
    if (!expirationDate || expirationDate.trim() === '') {
      errors['expiration_date'] = 'Enter an Expiry Date';
    } else if (expirationDate.length > 0) {
      const arr = expirationDate.split('/');
      if (arr.length === 2) {
        const expMonth = parseInt(arr[0]);
        const expYear = parseInt(arr[1]);
        
        if (expYear < this.currentYear) {
          errors['expiration_date'] = 'The expiry date must be in the future';
        } else if (expMonth < this.currentMonth && expYear <= this.currentYear) {
          errors['expiration_date'] = 'The expiry date must be in the future';
        }
      }
    }
    
    // Security code validation
    if (!securityCode || securityCode.trim() === '') {
      errors['security_code'] = 'Enter a CVV Code';
    } else if (isNaN(Number(securityCode))) {
      errors['security_code'] = 'Enter a valid CVV Code';
    } else if (securityCode.length < 3 || securityCode.length > 4) {
      errors['security_code'] = 'Enter a valid CVV Code';
    }
    
    // Billing address validation (if not using same as shipping)
    if (!billingAddressCheck) {
      if (!billingAddressLine1 || billingAddressLine1.trim() === '') {
        errors['billing_address_line1'] = 'Enter a Billing Address';
      } else if (billingAddressLine1.replace(/\s/g, '').length < 2) {
        errors['billing_address_line1'] = 'Enter a valid Billing Address';
      }
      
      if (!billingCity || billingCity.trim() === '') {
        errors['billing_city'] = 'Enter a City';
      } else if (billingCity.replace(/\s/g, '').length < 2) {
        errors['billing_city'] = 'Enter valid City';
      }
      
      if (!billingState || billingState.trim() === '') {
        errors['billing_state'] = 'Select a State';
      }
      
      if (!billingZip || billingZip.trim() === '') {
        errors['billing_zip'] = 'Enter a Zip Code';
      } else if (billingZip.replace(/\s/g, '').length < 2) {
        errors['billing_zip'] = 'Enter a valid Zip Code';
      }
      
      if (!billingCountry || billingCountry.trim() === '') {
        errors['billing_country'] = 'Country can not be empty';
      }
      
      // Zip code pattern validation
      if (billingZip && billingCountry) {
        const usZipCodePattern = /^\d{5}$/;
        const canadianZipCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        
        if (billingCountry === 'US') {
          if (!usZipCodePattern.test(billingZip)) {
            errors['billing_zip'] = 'Enter a valid Zip Code';
          }
        } else {
          if (!canadianZipCodePattern.test(billingZip)) {
            errors['billing_zip'] = 'Enter a valid Zip Code';
          }
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Performs security check to prevent script injection
   */
  private performSecurityCheck(...fields: string[]): boolean {
    for (const field of fields) {
      if (field !== '' && field.toLowerCase().includes('script')) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets validation errors for display in the UI
   */
  getValidationErrors(paymentForm: FormGroup, billingAddressCheck: boolean): { [key: string]: string } {
    const formValue = paymentForm.value;
    
    const validationResult = this.validatePaymentData(
      formValue.card_holder_name || '',
      formValue.card_number || '',
      formValue.expiration_date || '',
      formValue.security_code || '',
      formValue.billing_address_line1 || '',
      formValue.billing_city || '',
      formValue.billing_state || '',
      formValue.billing_zip || '',
      formValue.billing_country || '',
      billingAddressCheck
    );
    
    return validationResult.errors;
  }
}