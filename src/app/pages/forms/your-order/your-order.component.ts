import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-your-order',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './your-order.component.html',
  styleUrl: './your-order.component.scss'
})
export class YourOrderComponent implements OnInit {
  private agreementService = inject(OnlineFormAgreementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  agreementId: string = '';
  ifPackageisAditCore: boolean = false;
    ifPackageAditLite: boolean = false;
  signature_url:string='';
  addOnPhone: boolean = false;
  addOnAnalytic: boolean = false;
  addOnVerification: boolean = false;
  isAnnually: boolean = false;
  no_of_days: number = 0;
  multiple_location:string = 'no';
  locations: any[] = [];
  selectedSubscriptionPrice: number = 0;
  activation_fee: number = 0;
  hardware_Total: number = 0;
  hardwareCreditApplied: any
  totalPayment: number = 0;
  nextPaymentDate: string = '';
  selectedPackageName: string = '';
    pricingArray: any;
  dynamicPackages: { value: string; label: string }[] = [
    { value: 'tech', label: 'Tech Bundle' },
    { value: 'analytic', label: 'Analytic Bundle' },
    { value: 'custom', label: 'Custom Package' }, // Example of additional dynamic options
  ];
  hardware_counts: { count: number; price: number }[][] = [];
  totalHardwarePrice: number = 0; 
  hardwareCreditAnnually:number=0
  hardwareCreditMonthly:number=0
  signatory_name: any;
  dateSigned: any;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agreementId = params['agreementId'];
    });

       this.agreementService.getAgreement(this.agreementId).subscribe((res) =>{
        if(res.data.status=="Expired"){
          // Handle expired agreement case
          this.router.navigate(['/expired/', this.agreementId]);
        }
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
      let responseData = res.data; // Assuming this is the key in the response
      
      this.pricingArray = includedKeys.reduce((acc, key) => {
        if (responseData.hasOwnProperty(key)) {
          acc[key] = responseData[key]; // Add the key-value pair to the object
        }
        return acc;
      }, {} as { [key: string]: any }); // Initialize as an empty object

      const groupedKeys: {
        [prefix: string]: { value: string; label: string };
      } = {};

      Object.keys(this.pricingArray)
        .filter((key) => this.pricingArray[key] !== null) // Filter keys with non-null values
        .filter((key) => !key.includes('add_on')) // Exclude keys containing 'add_on'
        .filter((key) => !key.includes('hardware')) // Exclude keys containing 'hardware'
        .forEach((key) => {
          const prefix = key.replace(
            /(_Only_Monthly|_Only_Annually|_monthly|_annually|Annual_Disc|Annual|Montly_Disc|Montly|Monthly_Disc|Monthly)$/,
            ''
          ); // Remove suffixes like _Monthly, _Annually, _Disc
          if (!groupedKeys[prefix]) {
            groupedKeys[prefix] = {
              value: prefix,
              label: this.formatKeyToLabel(prefix),
            };
          }
        });

      if(responseData.no_of_days>0 && responseData.no_of_days!=null){
        this.no_of_days = responseData.no_of_days;
      }else if(responseData.no_of_days==0 || responseData.no_of_days==null){
        this.no_of_days = 45;
      }
      if(responseData.isAnnually=='Monthly'){
        this.isAnnually = false;
      }else{
        this.isAnnually = true;
      }
    

      this.dynamicPackages = Object.values(groupedKeys);
        console.log(this.dynamicPackages, 'Dynamic Packages');
      //packages
        if(this.dynamicPackages.length > 0){
              if (this.dynamicPackages[0].value == 'aditCore') {
                this.ifPackageisAditCore = true;
                this.selectedPackageName = 'Adit Core';
              } else if (this.dynamicPackages[0].value == 'aditLite') {
                this.selectedPackageName = 'Adit Lite';
                this.ifPackageAditLite = true;
              } else {
                this.ifPackageisAditCore = false;
                this.ifPackageAditLite = false;
              }
        }
if (responseData.practiceData[0]) {
  this.locations = responseData.practiceData;
  if (
    responseData.practiceData[0].locationOrders &&
    responseData.practiceData[0].locationOrders.length > 0
  ) {
    let locationOrders = responseData.practiceData[0].locationOrders[0];
    this.activation_fee = Number(locationOrders.activation_fee);
    this.selectedSubscriptionPrice = locationOrders.subscription_fee;
    let idx = 0;
    console.log('hardware with idx', this.hardware_counts);

    // Initialize hardware_counts[idx] as an array of 8 objects
    if (!this.hardware_counts[idx]) {
      this.hardware_counts[idx] = Array(8)
        .fill(0)
        .map(() => ({ count: 0, price: 0 }));
    }

    // Assign counts
    this.hardware_counts[idx][0].count =
      Number(locationOrders.grandstream_grp2616_qty) || 0;
    this.hardware_counts[idx][1].count =
      Number(locationOrders.grandstream_grp2613_qty) || 0;
    this.hardware_counts[idx][2].count =
      Number(locationOrders.grandstream_dp720_qty) || 0;
    this.hardware_counts[idx][3].count =
      Number(locationOrders.grp_2616_wall_mount_qty) || 0;
    this.hardware_counts[idx][4].count =
      Number(locationOrders.grp_2613_wall_mount_qty) || 0;
    this.hardware_counts[idx][5].count =
      Number(locationOrders.headset_adapter_qty) || 0;
    this.hardware_counts[idx][6].count =
      Number(locationOrders.bbpos_wispos_qty) || 0;
    this.hardware_counts[idx][7].count =
      Number(locationOrders.bbpos_edock_qty) || 0;

    // Assign prices
    this.hardware_counts[idx][0].price =
      Number(locationOrders.granstrem_grp_2616_type) || 0;
    this.hardware_counts[idx][1].price =
      Number(locationOrders.granstrem_grp_2613_type) || 0;
    this.hardware_counts[idx][2].price =
      Number(locationOrders.granstrem_dp_720_type) || 0;
    this.hardware_counts[idx][3].price =
      Number(locationOrders.granstrem_grp_2616_wall_type) || 0;
    this.hardware_counts[idx][4].price =
      Number(locationOrders.granstrem_grp_2613_wall_type) || 0;
    this.hardware_counts[idx][5].price =
      Number(locationOrders.headset_adapter) || 0;
    this.hardware_counts[idx][6].price =
      Number(locationOrders.bbpos_wisepos) || 0;
    this.hardware_counts[idx][7].price =
      Number(locationOrders.bbpos_edock) || 0;

    // Update total hardware price
    const rowTotal = this.hardware_counts[idx].reduce(
      (sum, item) => sum + item.count * item.price,
      0
    );
    this.totalHardwarePrice += rowTotal;

    this.hardware_counts = [...this.hardware_counts]; // Trigger change detection
    console.log('HArdware cOuntt', this.hardware_counts);
  }
  console.log(this.locations);
}
    if(responseData.signature_url){
      this.signature_url=responseData.signature_url
    }
    if(responseData.signatory_name){
      this.signatory_name=responseData.signatory_name
    }
    if(responseData.updated_at){
      this.dateSigned=responseData.updated_at
    }
      if(responseData.hardwareCreditAnnually || responseData.hardwareCreditMonthly){
        this.hardwareCreditAnnually=responseData.hardwareCreditAnnually
        this.hardwareCreditMonthly=responseData.hardwareCreditMonthly
        let hardwareCredit = this.isAnnually ? Number(this.hardwareCreditAnnually) : Number(this.hardwareCreditMonthly);
        this.hardwareCreditApplied=this.getMinValue(hardwareCredit,this.totalHardwarePrice)
        console.log('Hardware Credit Applied:', this.hardwareCreditApplied);
      }
      this.totalPayment=Number(this.selectedSubscriptionPrice) + Number(this.activation_fee) + Number(this.totalHardwarePrice) - Number(this.hardwareCreditApplied);
      const priceAddons = responseData.priceAddons;
      this.addOnPhone = priceAddons.phone_show === 'Yes';
      this.addOnAnalytic = priceAddons.analytics_show === 'Yes';
      this.addOnVerification = priceAddons.verification_show === 'Yes';

       })

  }
  showAgreement(){
    const agreementUrl = `/pdf/${this.agreementId}`;
    window.open(agreementUrl, '_blank');
  }
    makeFirstLetterCapital(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
      formatKeyToLabel(key: string): string {
    // Convert camelCase or snake_case keys into readable labels
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }
    getNextPaymentDate(): string {
    const currentDate = new Date(this.dateSigned);
    if (this.isAnnually) {
      currentDate.setFullYear(currentDate.getFullYear() + 1); // Add 1 year
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1); // Add 1 month
    }

    // Format the date as "MMM DD, YYYY"
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    return currentDate.toLocaleDateString('en-US', options).toUpperCase();
  }
    getMinValue(
    value1: number | null | undefined,
    value2: number | null | undefined
  ): number | null {
    // console.log(value1, value2, 'value1 and value2')
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
}
