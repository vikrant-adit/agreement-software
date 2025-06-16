import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  // Calculate location total for annual billing
  calculateLocationTotal(
    basePackagePrice: number,
    isAnnually: boolean,
    phoneAddOn: number,
    analyticsAddOn: number,
    verificationAddOn: number
  ): number {
    if (isAnnually) {
      return (basePackagePrice + phoneAddOn + analyticsAddOn + verificationAddOn) *12;
    }
    return 0;
  }

  // Calculate location total for monthly billing
  calculateLocationTotalForMonthly(
    subscriptionPriceMonthly: number,
    phoneAddOn: number,
    analyticsAddOn: number,
    verificationAddOn: number
  ): number {
    return subscriptionPriceMonthly + phoneAddOn + analyticsAddOn + verificationAddOn;
  }

  // Get the next payment date
  getNextPaymentDate(isAnnually: boolean): string {
    const currentDate = new Date();
    if (isAnnually) {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    return currentDate.toLocaleDateString('en-US', options).toUpperCase();
  }

  // Calculate total subscription price across all locations
  getSubscriptionTotalForMultipleLocations(
    locations: any[],
    calculateLocationTotal: (index: number) => number
  ): number {
    let total = 0;
    for (let i = 0; i < locations.length; i++) {
      const locationTotal = calculateLocationTotal(i);
      total += locationTotal;
    }
    return total;
  }

  // Based on package type, get the base package price
  getBasePackagePrice(
    isAnnually: boolean,
    ifPackageisAditCore: boolean,
    ifPackageAditLite: boolean,
    selectedPackageName: string,
    pozativeSelectedChange: boolean,
    verificationsNVPSelectedChange: boolean,
    multiple_location: string,
    subscriptionPlans: { annually: number; monthly: number }[],
    priceData: any
  ): number {
    if (ifPackageisAditCore) {
      return Number(isAnnually ? priceData.aditCore_annually : priceData.aditCore_monthly) || 0;
    } else if (ifPackageAditLite) {
      return Number(isAnnually ? priceData.aditLiteAnnual : priceData.aditLiteMontly) || 0;
    } else if (selectedPackageName === 'Tech Bundle') {
      return Number(isAnnually ? priceData.techAnnual : priceData.techMonthly) || 0;
    } else if (selectedPackageName === 'Analytic Bundle') {
      return Number(isAnnually ? priceData.analyticAnnual : priceData.analyticMonthly) || 0;
    } else if (pozativeSelectedChange) {
      return Number(isAnnually ? priceData.pozative_Only_Annually : priceData.pozative_Only_Monthly) || 0;
    } else if (verificationsNVPSelectedChange) {
      return Number(isAnnually ? priceData.verifications_Only_Annually : priceData.verifications_Only_Monthly) || 0;
    }

    if (multiple_location === 'yes' && subscriptionPlans.length > 0) {
      return subscriptionPlans.reduce(
        (sum, plan) => sum + Number(isAnnually ? plan.annually : plan.monthly), 0
      );
    }

    return 0;
  }
}