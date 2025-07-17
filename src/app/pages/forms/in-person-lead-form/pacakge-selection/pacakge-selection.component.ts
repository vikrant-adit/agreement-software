import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { promotionPricing } from '../../pre-agreement-form/pricingArr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pacakge-selection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './pacakge-selection.component.html',
  styleUrl: './pacakge-selection.component.scss',
})
export class PacakgeSelectionComponent implements OnInit {
  packageControl = new FormControl('Event');
  @Input() currency: 'USD' | 'CAD' = 'USD'; // default to USD

  packagesArray :any

  item = 'Event';

  pricingArray: any;
  annulaOrMonth!: boolean;
  phoneSelected: boolean = false;
  analyticsSelected: boolean = false;
  isAnnually: boolean = true;
  selectAddonPhone = false;
  selectAddonAnalytics = false;
  aditCoreSelected = true;
  techSelected: boolean = false;
  analyticSelected: boolean = true;
  aditLiteSelected: boolean = false;
  newPackageTotalAnnualy: number = 0;
  newPackageTotalMonthly: number = 0;
    constructor(
    // ...other injections...
    private dialogRef: MatDialogRef<PacakgeSelectionComponent>
  ) {
    // dialogRef.close({result:'dfsgg'})
  } 
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
  }
  whichOneToShow: string = 'Event';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['annulaOrMonth']) {
      this.isAnnually = this.annulaOrMonth;
    }
     if (changes['currency'] && !changes['currency'].firstChange) {
    // Remap all packages to the new currency
    this.packagesArray = {
      'Smile Source': this.mapPricingToCurrency(promotionPricing['Smile Source'], this.currency),
      'TruBlu': this.mapPricingToCurrency(promotionPricing['TruBlu'], this.currency),
      'DDSOM': this.mapPricingToCurrency(promotionPricing['DDSOM'], this.currency),
      'AIDA Member': this.mapPricingToCurrency(promotionPricing['AIDA Member'], this.currency),
      'Event': this.mapPricingToCurrency(promotionPricing['Event'], this.currency),
      'Outbound AE': this.mapPricingToCurrency(promotionPricing['Outbound AE'], this.currency)
    };
    // Update current pricingArray as well
    if (this.packagesArray.hasOwnProperty(this.item)) {
      this.pricingArray = this.packagesArray[this.item];
      this.newPackageTotalAnnualy = this.pricingArray.aditCore_annually || 0;
      this.newPackageTotalMonthly = this.pricingArray.aditCore_monthly || 0;
    }
  }
  }
  phoneSelected_update: any;
  analyticsSelected_update: any;
 updatePricesForCurrency() {
    // Example: update the displayed prices based on this.currency
    if (this.pricingArray) {
      // Update your price variables here
      this.newPackageTotalAnnualy = this.pricingArray.aditCore_annually?.[this.currency] || 0;
      this.newPackageTotalMonthly = this.pricingArray.aditCore_monthly?.[this.currency] || 0;
      console.log('this.newPackageTotalAnnualy asfdddddddddddddddd', this.newPackageTotalAnnualy, this.newPackageTotalMonthly);
      // Repeat for other price fields as needed
    }
  }
  ngOnInit(): void {
    this.packagesArray = {
    'Smile Source': this.mapPricingToCurrency(promotionPricing['Smile Source'], this.currency),
    'TruBlu': this.mapPricingToCurrency(promotionPricing['TruBlu'], this.currency),
    'DDSOM': this.mapPricingToCurrency(promotionPricing['DDSOM'], this.currency),
    'AIDA Member': this.mapPricingToCurrency(promotionPricing['AIDA Member'], this.currency),
    'Event': this.mapPricingToCurrency(promotionPricing['Event'], this.currency),
    'Outbound AE': this.mapPricingToCurrency(promotionPricing['Outbound AE'], this.currency)
  };


    this.packageControl.valueChanges.subscribe((value) => {
             this.pricingArray=[]

      // console.log('Selected package:', value);      
      if (value && this.packagesArray.hasOwnProperty(value)) {
              this.pricingArray = this.packagesArray[value];
              console.log('this.pricingArray', this.pricingArray);
               this.whichOneToShow =value;
        // console.log('Selected package:', value,this.packagesArray.hasOwnProperty(value));
      }
    });
    if(this.packagesArray.hasOwnProperty(this.item)){
      this.pricingArray = this.packagesArray[this.item];
      
      this.newPackageTotalAnnualy=this.pricingArray.aditCore_annually;
      this.newPackageTotalMonthly=this.pricingArray.aditCore_monthly;
      console.log('this.pricingArray', this.pricingArray,this.newPackageTotalAnnualy,this.newPackageTotalMonthly);
    }
    this.isAnnually = this.annulaOrMonth;
    this.aditCoreSelected = false;
        // this.updatePricesForCurrency();

  }

  oldPacakSelection(packageSelected: any) {
    if (packageSelected == 'tech') {
      this.techSelected = true;
      this.analyticSelected = false;
      this.getPricingOverallForOld_pacakge();
    } else if (packageSelected == 'analytic') {
      this.analyticSelected = true;
      this.techSelected = false;
      this.getPricingOverallForOld_pacakge();
    } 
  }

  getPricingOverallForOld_pacakge() {
    const keysWithValues = Object.keys(this.pricingArray)

      .filter((key) => this.pricingArray[key] !== null) // Filter keys with non-null values
      .map((key) => ({ key, value: this.pricingArray[key] })); // Map to an array of objects with key and value
    let totaltechAnnually = 0;
    let totaltechMonthly = 0;
    let totalAnalyticMonthly = 0;
    let totallAnalyticAnnually = 0;
    let totalAditLiteMonthly = 0;
    let totalAditLiteAnnually = 0;
    // Calculate totals

    keysWithValues.forEach((item) => {
      // console.log(item)
      const numericValue = parseFloat(item.value); // Convert value to a number
      if (isNaN(numericValue)) return; // Skip invalid values
      if (
        item.key == 'techMonthly' ||
        item.key == 'analyticAnnual' ||
        item.key == 'techAnnual' ||
        item.key == 'analyticMonthly' ||
        item.key == 'aditLiteMontly' ||
        item.key == 'aditLiteAnnual'
      ) {
        return;
      }
      if (item.key.includes('tech')) {
        if (item.key == 'techMonthly_Disc') {
          totaltechMonthly += numericValue;
        } else if (item.key == 'techAnnual_Disc') {
          totaltechAnnually += numericValue;
        } else {
          // Add to both totals for keys that don't contain "monthly" or "annually"
          totaltechAnnually += numericValue;
          totaltechMonthly += numericValue;
        }
      } else if (item.key.includes('analytic')) {
        if (item.key == 'analyticMonthly_Disc') {
          totalAnalyticMonthly += numericValue;
        } else if (item.key == 'analyticAnnual_Disc') {
          totallAnalyticAnnually += numericValue;
        } else {
          // Add to both totals for keys that don't contain "monthly" or "annually"
          totallAnalyticAnnually += numericValue;
          totalAnalyticMonthly += numericValue;
        }
      } else if (item.key.includes('aditLite')) {
        if (item.key == 'aditLiteMontly_Disc') {
          totalAditLiteMonthly += numericValue;
        } else if (item.key == 'aditLiteAnnual_Disc') {
          totalAditLiteAnnually += numericValue;
        } else {
          totalAditLiteAnnually += numericValue;
          totalAditLiteMonthly += numericValue;
        }
      }
    });

    if (this.techSelected) {
      this.newPackageTotalAnnualy = totaltechAnnually;
      this.newPackageTotalMonthly = totaltechMonthly;
    } else if (this.analyticSelected) {
      this.newPackageTotalAnnualy = totallAnalyticAnnually;
      this.newPackageTotalMonthly = totalAnalyticMonthly;
    } else if (this.aditLiteSelected) {
      this.newPackageTotalAnnualy = totalAditLiteAnnually;
      this.newPackageTotalMonthly = totalAditLiteMonthly;
    } else if (
      !this.analyticSelected &&
      !this.techSelected &&
      !this.aditLiteSelected
    ) {
      this.newPackageTotalAnnualy = 0;
      this.newPackageTotalMonthly = 0;
    }
  }


  phoneAddOnPriceAdd(price: any) {
    this.selectAddonPhone = !this.selectAddonPhone;
    if (!this.selectAddonPhone) {
      this.newPackageTotalAnnualy = this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly = this.newPackageTotalMonthly - parseInt(price);
    } else {
      this.newPackageTotalAnnualy = parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly = parseInt(price) + this.newPackageTotalMonthly;
    }

  } 
  analyticAddOnPriceAdd(price: any) {
    this.selectAddonAnalytics = !this.selectAddonAnalytics;
    if (!this.selectAddonAnalytics) {
      this.newPackageTotalAnnualy = this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly = this.newPackageTotalMonthly - parseInt(price);
    } else {
      this.newPackageTotalAnnualy = parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly = parseInt(price) + this.newPackageTotalMonthly;
    }
  }
  private mapPricingToCurrency(pricing: any, currency: 'USD' | 'CAD') {
  const mapped: any = {};
  for (const key in pricing) {
    if (
      pricing[key] &&
      typeof pricing[key] === 'object' &&
      (pricing[key].USD !== undefined || pricing[key].CAD !== undefined)
    ) {
      mapped[key] = pricing[key][currency] ?? 0;
    } else {
      mapped[key] = pricing[key];
    }
  }
  return mapped;
}
  confirmSelection() {
    this.dialogRef.close({
      selectedPackage: this.whichOneToShow,
      pricingArray: this.pricingArray
    });
  }
}
