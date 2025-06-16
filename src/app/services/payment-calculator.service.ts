import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentCalculatorService {
  // Calculate the total payment
  getTotalPayment(
    isAnnually: boolean,
    ifPackageisAditCore: boolean,
    multiple_location: string,
    subscriptionTotal: number,
    hardwarepurchasePrices: number[],
    extraharwarePrices: number[],
    hardware_TotalFor_Singlecoation: number,
    activation_fee: number,
    hardwareCreditAnnually: number,
    hardwareCreditMonthly: number
  ): number {
    let hardwareTotal = 0;
    let activationFee = Number(activation_fee) || 0;
    let total = 0;
    
    if (multiple_location === 'yes') {
      // Calculate hardware total per location and apply credit individually
      let totalEffectiveHardware = 0;
      let totalAppliedCredit = 0;
      
      // Hardware credit per location
      const hardwareCreditPerLocation = Number(isAnnually ? 
        hardwareCreditAnnually : hardwareCreditMonthly) || 0;
      
      // Process each location individually
      for (let i = 0; i < hardwarepurchasePrices.length; i++) {
        const locationHardwarePrice = Number(hardwarepurchasePrices[i] || 0);
        const locationExtraPrice = Number(extraharwarePrices[i] || 0);
        
        // Only apply credit where hardware is purchased
        if (locationHardwarePrice > 0 || locationExtraPrice > 0) {
          // Calculate the total hardware for this location
          const locationTotalHardware = locationHardwarePrice + locationExtraPrice;
          
          // Calculate effective hardware cost after applying credit
          const appliedCredit = Math.min(locationTotalHardware, hardwareCreditPerLocation);
          const effectiveLocationHardware = Math.max(0, locationTotalHardware - appliedCredit);
          
          // Add to totals
          totalEffectiveHardware += effectiveLocationHardware;
          totalAppliedCredit += appliedCredit;
        }
      }
      
      // Set the final hardware total
      hardwareTotal = totalEffectiveHardware;
      
      // Calculate final total
      total = subscriptionTotal + hardwareTotal + activationFee;
    } else if (multiple_location === 'no') {
      // For single location
      const hardwareCredit = Number(isAnnually ? hardwareCreditAnnually : hardwareCreditMonthly) || 0;
      hardwareTotal = Number(hardware_TotalFor_Singlecoation) || 0;
      
      // Apply hardware credit only up to the hardware total amount
      let effectiveHardwareTotal = hardwareTotal;
      if (hardwareTotal > 0 && hardwareCredit > 0) {
        effectiveHardwareTotal = Math.max(0, hardwareTotal - hardwareCredit);
      }
      
      // Calculate final total
      total = subscriptionTotal + effectiveHardwareTotal + activationFee;
    }
    
    return total;
  }

  // Get total hardware credit
  getHardwareCreditTotal(
    multiple_location: string,
    purchasePhones: boolean[],
    purchaseTerminals: boolean[],
    isAnnually: boolean,
    hardwareCreditAnnually: number,
    hardwareCreditMonthly: number
  ): number {
    if (multiple_location === 'yes') {
      // Count how many locations have actually selected hardware
      const locationsWithHardware = purchasePhones
        .map((phoneSelected, index) => phoneSelected || purchaseTerminals[index])
        .filter(hasHardware => hasHardware).length;
      
      // Credit per location
      const creditPerLocation = isAnnually 
        ? Number(hardwareCreditAnnually) || 0 
        : Number(hardwareCreditMonthly) || 0;
      
      return locationsWithHardware * creditPerLocation;
    } else {
      // For single location, just return the standard credit
      return isAnnually 
        ? Number(hardwareCreditAnnually) || 0 
        : Number(hardwareCreditMonthly) || 0;
    }
  }

  // Convert string to number safely
  convertStringToNumber(value: string | null): number {
    if (value === null) {
      return 0;
    }
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  }
}