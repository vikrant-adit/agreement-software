import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  // Hardware configuration
  hardwareConfig = {
    prices: [150, 100, 100, 10, 10, 275, 250, 49], // Base prices
    names: [
      'Grandstream GRP 2616',
      'Grandstream GRP 2613',
      'Grandstream DP 720',
      'GRP 2616 Wall Mount',
      'GRP 2613 Wall Mount',
      'Headset + Adapter',
      'BBPOS WisePOS E',
      'BBPOS WisePOS E Dock'
    ],
    phoneIndices: [0, 1, 2, 3, 4, 5], // Indices that represent phones
    terminalIndices: [6, 7]  // Indices that represent terminals
  };

  // Hardware price calculation methods
  getHardwarePrice(hardwareIndex: number): number {
    return this.hardwareConfig.prices[hardwareIndex] || 0;
  }

  calculateTotalHardwarePrice(prices: number[]): number {
    return prices.reduce((total, price) => total + price, 0);
  }

  getMinValue(value1: number | null | undefined, value2: number | null | undefined): number | null {
    if (value1 != null && value2 != null) {
      return Math.min(value1, value2);
    }
    if (value1 != null) {
      return value1;
    }
    if (value1 == null) {
      return 0;
    }
    return null;
  }

  calculateHardwareInventoryForLocation(
    purchasePhones: boolean[], 
    purchaseTerminals: boolean[], 
    hardware_counts: any[][], 
    locationNames: string[]
  ): { [locationId: string]: { [hardwareName: string]: number } } {
    const locationHardware: { [locationId: string]: { [hardwareName: string]: number } } = {};

    // Process each location
    locationNames.forEach((locationName, locationIndex) => {
      locationHardware[locationName] = {};

      // Add phones if they're purchased for this location
      if (purchasePhones[locationIndex]) {
        // Add each type of phone hardware
        this.hardwareConfig.names.slice(0, 6).forEach((phoneName, phoneIndex) => {
          const count = hardware_counts[locationIndex][phoneIndex].count;
          if (count > 0) {
            locationHardware[locationName][phoneName] = count;
          }
        });
      }

      // Add terminals if they're purchased for this location
      if (purchaseTerminals[locationIndex]) {
        // Add each type of terminal hardware
        const terminalNames = ['BBPOS WisePOS E', 'BBPOS WisePOS E Dock'];
        terminalNames.forEach((terminalName, terminalIndex) => {
          // Terminal indices start after the phone indices
          const hardwareIndex = 6 + terminalIndex;
          const count = hardware_counts[locationIndex][hardwareIndex].count;
          if (count > 0) {
            locationHardware[locationName][terminalName] = count;
          }
        });
      }
    });

    return locationHardware;
  }

  initializeHardwareCounts(locationsLength: number, hardwarePrices: number[]): { count: number; price: number }[][] {
    const hardware_counts: { count: number; price: number }[][] = [];
    
    // For each location, create an array of hardware items
    for (let i = 0; i < locationsLength; i++) {
      hardware_counts[i] = [];

      // For each hardware price, create a count and price object
      for (let j = 0; j < hardwarePrices.length; j++) {
        hardware_counts[i][j] = {
          count: j === 0 ? 2 : 0, // Default to 2 for the first item, 0 for others
          price: j === 0 ? 2 * this.getHardwarePrice(j) : 0,
        };
      }
    }
    
    return hardware_counts;
  }

  // Update hardware purchase price for a specific location
  updateHardwarePurchasePrice(
    hardware_counts: { count: number; price: number }[][], 
    rowIndex: number, 
    hardwareCreditValue: number,
    hardwarepurchasePrices: number[],
    extraharwarePrices: number[]
  ): void {
    const totalHardwarePrice = hardware_counts[rowIndex].reduce(
      (total, hardware) => total + hardware.price,
      0
    );

    if (totalHardwarePrice > hardwareCreditValue) {
      hardwarepurchasePrices[rowIndex] = Number(hardwareCreditValue);
      extraharwarePrices[rowIndex] = Number(totalHardwarePrice - hardwareCreditValue);
    } else {
      hardwarepurchasePrices[rowIndex] = Number(totalHardwarePrice);
      extraharwarePrices[rowIndex] = 0;
    }
  }
}