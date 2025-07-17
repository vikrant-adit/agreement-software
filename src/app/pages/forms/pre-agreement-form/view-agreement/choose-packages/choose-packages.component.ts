//chose comontne ts
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-choose-packages',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './choose-packages.component.html',
  styleUrl: './choose-packages.component.scss',
})
export class ChoosePackagesComponent implements OnInit {
  @Output() totalAnnually = new EventEmitter<Number>();
  @Output() totalMonthly = new EventEmitter<Number>();

  @Output() totaltechAnnually = new EventEmitter<Number>();
  @Output() totaltechMonthly = new EventEmitter<Number>();

  @Output() totalanalyticAnnually = new EventEmitter<Number>();
  @Output() totalanalyticMonthly = new EventEmitter<Number>();

  @Output() totalAditLiteAnnually = new EventEmitter<Number>();
  @Output() totalAditLiteMonthly = new EventEmitter<Number>();

  @Output() isAnnualOrMonthly = new EventEmitter<boolean>();
  @Output() clickedNext = new EventEmitter<boolean>();

  // @Output() selectedBundle =new EventEmitter<string>();

  @Output() selectedPhone = new EventEmitter<boolean>();
  @Output() selectedAnalytics = new EventEmitter<boolean>();
  @Output() selectedVerification = new EventEmitter<boolean>();
  @Output() phoneSelectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(); // Output to parent
  @Output() verificationSelectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(); // Output to parent
  @Output() analyticsSelectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(); // Output to parent
  //setting for no vendor promo
  @Output() verificationsNVPSelectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(); // Output to parent
  @Output() pozativeSelectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(); // Output to parent
  @Input() verificationsNVPSelected!: boolean;
  @Input() pozativesSelected!: boolean;
  //select addons for novendor promo
  @Output() selectedPhone_nvp = new EventEmitter<any>();
  @Output() selectedAnalytics_nvp = new EventEmitter<any>();
  @Output() selectedVerification_nvp = new EventEmitter<any>();

  toggleanalyticsSelection(): void {
    this.analyticsSelected = !this.analyticsSelected;
    this.analyticsSelectedChange.emit(this.analyticsSelected); // Emit the updated value
  }
  toggleverificationSelection(): void {
    this.verificationSelected = !this.verificationSelected;
    this.verificationSelectedChange.emit(this.verificationSelected); // Emit the updated value
  }
  togglePhoneSelection(): void {
    this.phoneSelected = !this.phoneSelected;
    this.phoneSelectedChange.emit(this.phoneSelected); // Emit the updated value
  }

  packagesArray: any = {
    'Smile Source': 'old_package',
    tech: 'old_package',
    analytic: 'old_package',
    'Adit Lite': 'only_lite',
    'Adit Core': 'new_package',
    TruBlu: 'old_package',
    DDSOM: 'old_package',
    'AIDA Member': 'old_package',
    Custom: 'old_package',
    Event: 'new_package', // If values are exhausted, duplicates may occur
    'Outbound AE': 'old_package',
    'Outbound AE (Lite)': 'adit_lite_and_tech_analytics',
    'Outbound AE (Only Lite)': 'only_lite',
    'Only Lite - 1st Yr Promo': 'only_lite',
    Admin: 'old_package',
    'No Vendor Promo': 'no_vendor_promo',
    'Inbound Core': 'new_package',
    'Inbound Free Verifications': 'new_package',
    'Inbound Free Phones': 'new_package',
    'Outbound Free Phones': 'new_package',
    'Outbound Core': 'new_package',
    'Outbound Free Verifications': 'new_package',
    'Outbound Core - 1st Yr': 'new_package',
    tech_withAditLite: 'adit_lite_and_tech_analytics',
    analytic_withAditLite: 'adit_lite_and_tech_analytics',
    aditLite: 'adit_lite_and_tech_analytics',
    Pozative :'no_vendor_promo'
  };

  @Input() item = '';
  @Input() multiple_location = '';
  @Input() pricingArray: any;
  @Input() annulaOrMonth!: boolean;
  @Input() phoneSelected: boolean = false;
  @Input() verificationSelected: boolean = false;
  @Input() analyticsSelected: boolean = false;

  @Input() phoneSelect: boolean = false;
  @Input() verificationSelect: boolean = false;
  @Input() analyticSelect: boolean = false;
  isAnnually: boolean = true;

  selectAddonPhone = true;
  selectAddonAnalytics = true;
  selectAddonVerification = true;

  aditCoreSelected = true;
  pozativeSelected = false;
  verificationsSelected = false;

  techSelected: boolean = false;
  analyticSelected: boolean = false;
  aditLiteSelected: boolean = false;
  //totals
  newPackageTotalAnnualy: number = 0;
  newPackageTotalMonthly: number = 0;
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
    this.isAnnualOrMonthly.emit(this.isAnnually);
  }
  whichOneToShow: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['annulaOrMonth']) {
      this.isAnnually = this.annulaOrMonth;
      // React to data changes
    }
  }
  phoneSelected_update: any;
  verificationSelected_update: any;
  analyticsSelected_update: any;
  //handle promotion date
  @Input() promotionDate: any;
  promotionDateSelected: boolean = false;

  ngOnInit(): void {
    // Set promotionDateSelected immediately if promotionDate exists
    this.promotionDateSelected = !!this.promotionDate;

    // For debugging
    // console.log('prizing on init:', this.pricingArray);

    setTimeout(() => {
      this.promotionDateSelected = true;
    }, 100);
    this.isAnnually = this.annulaOrMonth;
    if (this.item && this.packagesArray.hasOwnProperty(this.item)) {
      const value = this.packagesArray[this.item];
      this.whichOneToShow = value;
      if (value == 'new_package') {
        console.log('new package selected');
        this.getPricingOverallForOtherPacakge();
        this.selectedPhone.emit(this.selectAddonPhone);
        this.selectedAnalytics.emit(this.selectAddonAnalytics);
        this.selectedVerification.emit(this.selectAddonVerification);
      }
      // console.log(` Value: ${value}, Item: ${this.item}`);
      if (this.item == 'tech') {
        this.oldPacakSelection('tech');
        this.techSelected = true;
        this.analyticSelected = false;
        this.aditLiteSelected = false;
      } else if (this.item == 'analytic') {
        this.oldPacakSelection('analytic');
        this.analyticSelected = true;
        this.techSelected = false;
        this.aditLiteSelected = false;
      } else if (this.item == 'tech_withAditLite') {
        this.oldPacakSelection('tech_withAditLite');
        this.techSelected = true;
        this.analyticSelected = false;
        this.aditLiteSelected = false;
      } else if (this.item == 'analytic_withAditLite') {
        this.oldPacakSelection('analytic_withAditLite');
        this.analyticSelected = true;
        this.techSelected = false;
        this.aditLiteSelected = false;
      } else if (this.item == 'aditLite' || this.item == 'Adit Lite') {
        this.oldPacakSelection('aditLite');
        this.aditLiteSelected = true;
        this.analyticSelected = false;
        this.techSelected = false;
      } else if(this.item == 'Pozative'){
        console.log('Pozative selected')
      this.aditCoreSelected = false;
      this.phoneSelected = false;
      this.verificationSelected = false;
      this.analyticsSelected = false;
      this.pozativeSelected = true;
      this.verificationsSelected = false;

      }
    } else {
      alert('Package not found');
    }
    
    if (this.multiple_location == 'yes') {
      this.techSelected = true;
      this.analyticSelected = true;
      this.aditLiteSelected = true;
      this.phoneSelected = true;
      // this.verificationSelected = true;
      this.analyticsSelected = true;
      // this.pozativeSelected=true
      //  console.log('Yess multiple location')
    } else {
      this.pozativeSelected = false;
      this.aditCoreSelected = false;
      this.verificationsSelected = false;
    }
    this.selectAddonPhone=this.phoneSelect
    this.selectAddonAnalytics=this.analyticSelect;
    this.selectAddonVerification=this.verificationSelect
  }
  @Output() packageSelectedChange = new EventEmitter<string>();

  oldPacakSelection(packageSelected: any) {
    if (packageSelected == 'tech' || packageSelected == 'tech_withAditLite') {
      this.techSelected = true;
      this.analyticSelected = false;
      this.aditLiteSelected = false;
      this.getPricingOverallForOld_pacakge();
    } else if (
      packageSelected == 'analytic' ||
      packageSelected == 'analytic_withAditLite'
    ) {
      this.analyticSelected = true;
      this.techSelected = false;
      this.aditLiteSelected = false;
      this.getPricingOverallForOld_pacakge();
    } else if (packageSelected == 'aditLite') {
      this.aditLiteSelected = true;
      this.analyticSelected = false;
      this.techSelected = false;
      this.getPricingOverallForOld_pacakge();
    }
    this.packageSelectedChange.emit(packageSelected); // <-- Emit to parent
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
          // Add to both totals for keys that don't contain "monthly" or "annually"
          totalAditLiteAnnually += numericValue;
          totalAditLiteMonthly += numericValue;
        }
      }
    });

    if (this.multiple_location == 'yes') {
      if (this.techSelected && this.analyticSelected) {
        this.totalanalyticAnnually.emit(totallAnalyticAnnually);
        this.totalanalyticMonthly.emit(totalAnalyticMonthly);
        this.totaltechAnnually.emit(totaltechAnnually);
        this.totaltechMonthly.emit(totaltechMonthly);
        if (this.aditLiteSelected) {
          this.totalAditLiteAnnually.emit(totalAditLiteAnnually);
          this.totalAditLiteMonthly.emit(totalAditLiteMonthly);
        }
      } else if (!this.analyticSelected && !this.techSelected) {
        this.totalanalyticAnnually.emit(0);
        this.totalanalyticMonthly.emit(0);
        this.totaltechAnnually.emit(0);
        this.totaltechMonthly.emit(0);
        if (!this.aditLiteSelected) {
          this.totalAditLiteAnnually.emit(0);
          this.totalAditLiteMonthly.emit(0);
        }
      }
    } else {
      if (this.techSelected) {
        this.newPackageTotalAnnualy = totaltechAnnually;
        this.totalAnnually.emit(this.newPackageTotalAnnualy);
        this.newPackageTotalMonthly = totaltechMonthly;
        this.totalMonthly.emit(this.newPackageTotalMonthly);
      } else if (this.analyticSelected) {
        this.newPackageTotalAnnualy = totallAnalyticAnnually;
        this.totalAnnually.emit(this.newPackageTotalAnnualy);
        this.newPackageTotalMonthly = totalAnalyticMonthly;
        this.totalMonthly.emit(this.newPackageTotalMonthly);
      } else if (this.aditLiteSelected) {
        this.newPackageTotalAnnualy = totalAditLiteAnnually;
        this.totalAnnually.emit(this.newPackageTotalAnnualy);
        this.newPackageTotalMonthly = totalAditLiteMonthly;
        this.totalMonthly.emit(this.newPackageTotalMonthly);
      } else if (
        !this.analyticSelected &&
        !this.techSelected &&
        !this.aditLiteSelected
      ) {
        this.newPackageTotalAnnualy = 0;
        this.totalAnnually.emit(0);
        this.newPackageTotalMonthly = 0;
        this.totalMonthly.emit(0);
      }
    }
  }

  getPricingOverallForOtherPacakge() {
    const keysWithValues = Object.keys(this.pricingArray)
      .filter((key) => this.pricingArray[key] !== null) // Filter keys with non-null values
      .map((key) => ({ key, value: this.pricingArray[key] })); // Map to an array of objects with key and value
    let totalAnnually = 0;
    let totalMonthly = 0;

    // Calculate totals
    keysWithValues.forEach((item) => {
      const numericValue = parseFloat(item.value); // Convert value to a number
      // console.log('item',item)
      if (isNaN(numericValue)) return; // Skip invalid values
      if (
        item.key == 'hardwareCreditAnnually' ||
        item.key == 'hardwareCreditMonthly' ||
        item.key == 'aditLiteMontly' ||
        item.key == 'aditLiteAnnual'
      ) {
        return;
      }
      if (item.key.includes('annually') || item.key.includes('Annual_Disc')) {
        // Add to totalAnnually if the key contains "annually"
        totalAnnually += numericValue;
        // console.log('totalAnnually',totalAnnually,item)
      } else if (
        item.key.includes('monthly') ||
        item.key.includes('Montly_Disc')
      ) {
        // Add to totalMonthly if the key contains "monthly"
        totalMonthly += numericValue;
        // console.log('totalMonthly',totalMonthly,item)
      } else {
        // Add to both totals for keys that don't contain "monthly" or "annually"
        // if (this.multiple_location != 'no') {
        //   totalAnnually += numericValue;
        //   totalMonthly += numericValue;
        // }
      }
    });
    this.newPackageTotalAnnualy = totalAnnually;
    this.totalAnnually.emit(this.newPackageTotalAnnualy);
    console.log('totalAnnually', this.newPackageTotalAnnualy);
    this.newPackageTotalMonthly = totalMonthly;
    this.totalMonthly.emit(this.newPackageTotalMonthly);
  }

  phoneAddOnPriceAdd(price: any) {
    this.selectAddonPhone = !this.selectAddonPhone;
    this.phoneSelected = !this.phoneSelected;
    if (!this.selectAddonPhone) {
      this.newPackageTotalAnnualy =
        this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly =
        this.newPackageTotalMonthly - parseInt(price);
    } else {
      this.newPackageTotalAnnualy =
        parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly =
        parseInt(price) + this.newPackageTotalMonthly;
    }
    // this.getPricingOverallForOtherPacakge()

    this.totalAnnually.emit(this.newPackageTotalAnnualy);
    this.totalMonthly.emit(this.newPackageTotalMonthly);
    this.selectedPhone.emit(this.selectAddonPhone);
  }
  analyticAddOnPriceAdd(price: any) {
    this.selectAddonAnalytics = !this.selectAddonAnalytics;
    this.analyticsSelected = !this.analyticsSelected;
    if (!this.selectAddonAnalytics) {
      this.newPackageTotalAnnualy =
        this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly =
        this.newPackageTotalMonthly - parseInt(price);
    } else {
      this.newPackageTotalAnnualy =
        parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly =
        parseInt(price) + this.newPackageTotalMonthly;
    }
    // this.getPricingOverallForOtherPacakge()
    this.totalAnnually.emit(this.newPackageTotalAnnualy);
    console.log(
      'totalAnnually add on anayltic',
      this.newPackageTotalAnnualy,
      this.selectAddonPhone
    );

    this.totalMonthly.emit(this.newPackageTotalMonthly);
    this.selectedAnalytics.emit(this.selectAddonAnalytics);
  }
  verificationAddOnPriceAdd(price: any) {
    this.selectAddonVerification = !this.selectAddonVerification;
    this.verificationSelected = !this.verificationSelected;
    if (!this.selectAddonVerification) {
      this.newPackageTotalAnnualy =
        this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly =
        this.newPackageTotalMonthly - parseInt(price);
    } else {
      this.newPackageTotalAnnualy =
        parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly =
        parseInt(price) + this.newPackageTotalMonthly;
    }
    // this.getPricingOverallForOtherPacakge()
    this.totalAnnually.emit(this.newPackageTotalAnnualy);
    this.totalMonthly.emit(this.newPackageTotalMonthly);
    console.log("asdasd",this.selectAddonVerification)
    this.selectedVerification.emit(this.selectAddonVerification);
  }

  //no vendor promo selection

  newPackageTotalMonthlyForNoVendorPromo: number = 0;
  newPackageTotalAnnuallyForNoVendorPromo: number = 0;
  packagePrice: any;
  selectpackage(pacakgeName: string) {
    
    if (pacakgeName == 'aditCore') {
          this.packageSelectedChange.emit(pacakgeName); // <-- Emit to parent

      this.phoneSelected = true;
      this.verificationSelected = true;
      this.analyticsSelected = true;
      this.aditCoreSelected = true;
      this.pozativeSelected = false;
      this.verificationsSelected = false;
      this.newPackageTotalMonthlyForNoVendorPromo =
        parseInt(this.pricingArray.aditCore_monthly || '0') +
        parseInt(this.pricingArray.add_on_phones || '0') +
        parseInt(this.pricingArray.add_on_analytic || '0') +
        parseInt(this.pricingArray.add_on_verification || '0');

      this.newPackageTotalAnnuallyForNoVendorPromo =
        parseInt(this.pricingArray.aditCore_annually || '0') +
        parseInt(this.pricingArray.add_on_phones || '0') +
        parseInt(this.pricingArray.add_on_analytic || '0') +
        parseInt(this.pricingArray.add_on_verification || '0');
      this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo);
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo);
      this.pozativeSelectedChange.emit(false);
      this.verificationsNVPSelectedChange.emit(false);
      // this.packagePrice = totalPrice;
    } else if (pacakgeName == 'pozative') {
        this.packageSelectedChange.emit(pacakgeName); // <-- Emit to parent

      this.aditCoreSelected = false;
      this.phoneSelected = false;
      this.verificationSelected = false;
      this.analyticsSelected = false;
      this.pozativeSelected = true;
      this.verificationsSelected = false;
      this.verificationsNVPSelectedChange.emit(false);
      this.pozativeSelectedChange.emit(true);
      this.newPackageTotalMonthlyForNoVendorPromo = parseInt(
        this.pricingArray.pozative_Only_Monthly
      );
      this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(
        this.pricingArray.pozative_Only_Annually
      );
      this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo);
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo);
      // this.packagePrice = totalPrice;
    } else if (pacakgeName == 'verification') {
        this.packageSelectedChange.emit(pacakgeName); // <-- Emit to parent

      this.aditCoreSelected = false;
     this.pozativeSelected = false;
      this.verificationsSelected = true;
      this.phoneSelected = false;

      this.verificationSelected = false;
      this.analyticsSelected = false;
      this.verificationsNVPSelectedChange.emit(true);
      this.pozativeSelectedChange.emit(false);
      this.newPackageTotalMonthlyForNoVendorPromo = parseInt(
        this.pricingArray.verifications_Only_Monthly
      );
      this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(
        this.pricingArray.verifications_Only_Annually
      );
      this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo);
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo);

      // this.packagePrice = totalPrice;
    }
  }

  phoneAddOnPriceAddNoVendor(price: any) {
    this.phoneSelected = !this.phoneSelected;
    if (!this.phoneSelected) {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo =
        this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
    } else {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo;
    }
    this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
    this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
    let valueNeedTobeSend = {
      selected: this.phoneSelected,
      price: price,
    };
    this.selectedPhone_nvp.emit(valueNeedTobeSend);
    // console.log('totalAnnually',this.newPackageTotalAnnuallyForNoVendorPromo,this.selectAddonPhone)
  }
  analyticAddOnPriceAddNoVendor(price: any) {
    this.analyticsSelected = !this.analyticsSelected;
    if (!this.analyticsSelected) {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo =
        this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
    } else {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo;
    }
     this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
    this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
    let valueNeedTobeSend = {
      selected: this.analyticsSelected,
      price: price,
    };
    this.selectedAnalytics_nvp.emit(valueNeedTobeSend);
  }
  verificationAddOnPriceAddNoVendor(price: any) {
    this.verificationSelected = !this.verificationSelected;
    if (!this.verificationSelected) {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo =
        this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
    } else {
      this.newPackageTotalAnnuallyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo =
        parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo;
    }

    this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
    this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
    let valueNeedTobeSend = {
      selected: this.verificationSelected,
      price: price,
    };
    console.log(
      'totalAnnually',valueNeedTobeSend)
    this.selectedVerification_nvp.emit(valueNeedTobeSend);
  }

  goNext() {
    if (this.techSelected || this.analyticSelected) {
      this.clickedNext.emit(true);
    }
  }

  handlePhoneAddOnClick(price: number): void {
    // if (this.multiple_location == 'yes') {
    this.phoneAddOnPriceAdd(price);
    // }
  }
  handleAnalyticsAddOnClick(price: number): void {
    // if (this.multiple_location == 'yes') {
    this.analyticAddOnPriceAdd(price);
    // }
  }
  handleVerificationAddOnClick(price: number): void {
    // if (this.multiple_location == 'yes') {
    this.verificationAddOnPriceAdd(price);
    // }
  }


}
