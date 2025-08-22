//view agreement comppoet
import {  AfterViewInit,  Component,  ElementRef,  inject,  OnDestroy,  OnInit,  QueryList,  ViewChild,} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../../header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import SignaturePad from 'signature_pad';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectorRef } from '@angular/core';
import {  ReactiveFormsModule,  FormsModule,  FormGroup,  FormBuilder,  Validators,  FormArray,} from '@angular/forms';
import {  verifications,  communicationsList,  mobile,  operations,  analytics,} from '../tech-stack-comparison/tech-stack-gaps';
import { OnlineFormAgreementService } from '../../../../../services/online form/online-form-agreement.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PhoneNumberFormatterDirective } from '../../../../../directives/phone-number-formatter.directive';
import { ChoosePackagesComponent } from './choose-packages/choose-packages.component';
import Swal from 'sweetalert2';
import { HardwareService } from '../../../../services/hardware.service';
import { MatDialog } from '@angular/material/dialog';
import { CardDetailsComponent } from '../view-agreement-multiple/card-details/card-details.component';

declare var google: any;
@Component({
  selector: 'app-view-agreement',
  standalone: true,
  imports: [ SweetAlert2Module, MatTooltipModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatDividerModule, MatIconModule, HeaderComponent, MatFormFieldModule, MatInputModule, MatSelectModule,MatTabsModule,ChoosePackagesComponent,PhoneNumberFormatterDirective,
  ],
  templateUrl: './view-agreement.component.html',
  styleUrl: './view-agreement.component.scss',
})
export class ViewAgreementComponent implements OnInit, AfterViewInit, OnDestroy {
  signatureNeeded!: boolean;
  communicationsList = communicationsList;
  operations = operations;
  analytics = analytics;
  mobile = mobile;
  verifications = verifications;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  agreementId!: string;
  totalCost: any = 0;
  isAnnually: boolean = true;
  selectPhone: any = null;
  selectTerminal: any = null;
  private hardwareService = inject(HardwareService);
  private agreementService = inject(OnlineFormAgreementService);
  showPaymentcard=false
  multiple_location: string = 'no'; // Toggle for multiple locations
  practiceData!: FormGroup;
  shippingAddressForm!: FormGroup;
  promotionDate: any;

  organization_name: any;
  organization_poc_name: any;
  organization_poc_email: any;
  organization_poc_work_number: any;
  organization_poc_cell_number: any;
  signature_name: any;
  signature_url:any;
  totalAnnually: any;
  totalMonthly: any;
  packageToBeShown: boolean = false;

  separateCard: boolean = true;

  // nextToHardware:boolean=false
  // signatureUrlFromApi: string | null = null; // Add this property to your class
  showOnlyTechStack: boolean = false;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  this.practiceData = this.fb.group({
      locations: this.fb.array([this.createLocationGroup()]) 
    });
    this.shippingAddressForm = this.fb.group({
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }
  expand: boolean = true;
  activation_fee: any;

  whichPackageToShow: any;
  showtechStackGap: boolean = true;
  subscriptionPriceMonthly!: number;
  subscriptionPriceAnnually!: number;
  //pricing objects
  analyticAnnual: any;
  techMonthly_Disc: any;
  analyticAnnual_Disc: any;
  techAnnual: any;
  techMonthly: any;
  techAnnual_Disc: any;
  analyticMonthly: any;
  analyticMonthly_Disc: any;

  aditLiteMontly: any;
  aditLiteMontly_Disc: any;
  aditLiteAnnual: any;
  aditLiteAnnual_Disc: any;

  aditCore_monthly: any;
  aditCore_annually: any;
  add_on_phones: any;
  add_on_analytic: any;
  add_on_verification: any;
  pozative_Only_Monthly: any;
  pozative_Only_Annually: any;
  verifications_Only_Monthly: any;
  verifications_Only_Annually: any;
  hardwareCreditAnnually: any;
  hardwareCreditMonthly: any;
  pricingArray: any;
  dynamicPackages: { value: string; label: string }[] = [
    { value: 'tech', label: 'Tech Bundle' },
    { value: 'analytic', label: 'Analytic Bundle' },
    { value: 'custom', label: 'Custom Package' }, // Example of additional dynamic options
  ];
  onNextClick(next: any) {
    this.expandHardware = next;
    this.onSubmit()
  }
  onTotalAnnually(total: any, source: any) {
    this.subscriptionPriceAnnually = this.totalAnnually = total;
    console.log(this.subscriptionPriceAnnually,this.totalAnnually, 'this is calledd', source);
    // this.calculateSubscriptionPrices();
    this.cdr.detectChanges()
  }
  onAnnuallyorMonthlly(isAnnual: any) {
    this.isAnnually = isAnnual;
  }
  // Method to handle totalMonthly event
  onTotalMonthly(total: any) {
    this.subscriptionPriceMonthly = this.totalMonthly = total;
  }
  convertStringToNumber(value: string | null): number {
    if (value === null) {
      return 0; // Return 0 if the value is null
    }
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue; // Return 0 if conversion fails
  }
  formatKeyToLabel(key: string): string {
    // Convert camelCase or snake_case keys into readable labels
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }
  
  sameAsPracticeAddress: boolean = false;
  countries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
  ];

  allActivePhone: boolean = true; // Separate property to track overall state of phone
  allActiveAnalytic: boolean = true; // Separate property to track overall state of phone
  allActiveVerification: boolean = true; // Separate property to track overall state of phone
  ifAnyActivePhone: boolean = true;
  addOnPhone: boolean = false;
  addOnAnalytic: boolean = false;
  addOnVerification: boolean = false;
  //no vendor promo objects
  verificationsNVPSelectedChange: boolean = false;
  selectedAddonPhone_nvp: boolean = false;
  selectedAddonAnalytic_nvp: boolean = false;
  selectedAddonVerification_nvp: boolean = false;
  pozativeSelectedChange: boolean = false;
  iconStates: {
    phoneActive: boolean;
    analyticActive: boolean;
    verificationActive: boolean;
    phoneSelectionActive: boolean;
    purchasePhone: boolean;
  }[] = [];
 practice_EHR:any
  checkConditionForHardware: boolean = false;
  no_of_days=45;
  ngOnInit(): void {
    // Initialize hardware_counts as a 2D array
    this.hardware_counts = [];
  const locationsArray = this.practiceData.get('locations') as FormArray;
  locationsArray.controls.forEach((locationGroup: any) => {
    locationGroup.get('practice_country')?.valueChanges.subscribe((country: string) => {
      const zipControl = locationGroup.get('practice_postal_zip_code');
      if (!zipControl) return;

      zipControl.clearValidators();

      if (country === 'UnitedStates') {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{5}(-\d{4})?$/)
        ]);
      } else if (country === 'Canada') {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
        ]);
      } else {
        zipControl.setValidators(Validators.required);
      }
      console.log(zipControl);
      zipControl.updateValueAndValidity();
    });
  });
    // console.log(this.checkGoogleMapsReady(),"Getsss the  maooooopp")
    // Load data from API
    this.loadAgreementData();
    
  }
  locationId: any[] = [];
  practiceDataArray: any[] = [];
  signatureExists: boolean = false;
  // Separate method for loading agreement data (keeps ngOnInit cleaner)
  private loadAgreementData(): void {
    this.agreementId = this.activeRoute.snapshot.params['agreementId'];

    this.agreementService.getAgreement(this.agreementId).subscribe((res) => {
      if(res.data.status=='Completed'){
        this.router.navigate(['/agreement/' + this.agreementId]);
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
      // Create an array of objects containing only the specified key-value pairs
      if(responseData.promotionExpiryDate_display){
        this.promotionDate = responseData.promotionExpiryDate_display;
      }
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
      }
      if(responseData.isAnnually=='Monthly'){
        this.isAnnually = false;
      }else{
        this.isAnnually = true;
      }

      if(responseData.practice_ehr){
        const group = this.getLocation(0);
        group.get('practice_management_software')?.setValue(responseData.practice_ehr);
        this.practice_EHR = responseData.practice_ehr;
      }
      // if(responseData.tech)
      // Convert grouped keys to an array
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
         if(responseData.practiceIndustry=='Chiropractic'){
        this.setCountTo1ForChiro=true
        this.counts_for_phone=[1,0,0,0,0,0]
        console.log(this.setCountTo1ForChiro,"SETINNGGG")
      }else{
                this.counts_for_phone=[2,0,0,0,0,0]

        this.setCountTo1ForChiro=false
         console.log(this.setCountTo1ForChiro,"SETINNGGG")
      }
      // console.log('Dynamic Packages:', this.dynamicPackages);
      this.iconStates = this.locations.controls.map(() => ({
        phoneActive: true,
        analyticActive: true,
        verificationActive: true,
        phoneSelectionActive: true,
        purchasePhone: true,
      }));
       console.log('Shipping Address from API:', responseData.shippingAddresses);
    if (responseData.shippingAddresses.length>0) {
        console.log('Shipping Address from API:', responseData.shippingAddresses); // Debug log


        // Create a patching object with a match between API and form control names
        const patchData = {
          address_line_1: responseData.shippingAddresses[0].addressLine1 || '',
          address_line_2: responseData.shippingAddresses[0].addressLine2 || '',
          city: responseData.shippingAddresses[0].city || '',
          state: responseData.shippingAddresses[0].state || '',
          postalCode: responseData.shippingAddresses[0].postalCode || '',
          country: responseData.shippingAddresses[0].country || '',
        };

        // console.log('Data to patch:', patchData); // Debug log
        this.shippingAddressForm.patchValue(patchData);

        // Force change detection
        setTimeout(() => {
          this.shippingAddressForm.updateValueAndValidity();
        });
      }
      this.multiple_location = responseData.multipleLocations;
      setTimeout(() => {
        if (responseData.add_on_phones !== null) {
        this.addOnPhone = true;
      }else{
        this.addOnPhone = false;
      }
      if (responseData.add_on_analytic != null) {
        this.addOnAnalytic = true;
      }else{
        this.addOnAnalytic = false;
      }
      if (responseData.add_on_verification != null) {
        this.addOnVerification = true;
      }else{
        this.addOnVerification = false;
      }
      },100)
      
      // console.log(this.pricingArray, 'EARRRRRRRRRRRRRR');
      this.activation_fee = responseData.activation_fee;
      this.analyticAnnual = responseData.analyticAnnual;
      this.techMonthly_Disc = responseData.techMonthly_Disc;
      this.analyticAnnual_Disc = responseData.analyticAnnual_Disc;
      this.techAnnual = responseData.techAnnual;
      this.techMonthly = responseData.techMonthly;
      this.techAnnual_Disc = responseData.techAnnual_Disc;
      this.analyticMonthly = responseData.analyticMonthly;
      this.analyticMonthly_Disc = responseData.analyticMonthly_Disc;

      this.aditLiteMontly = responseData.aditLiteMontly;
      this.aditLiteMontly_Disc = responseData.aditLiteMontly_Disc;
      this.aditLiteAnnual = responseData.aditLiteAnnual;
      this.aditLiteAnnual_Disc = responseData.aditLiteAnnual_Disc;

      this.aditCore_monthly = responseData.aditCore_monthly;
      this.aditCore_annually = responseData.aditCore_annually;
      this.add_on_phones = responseData.add_on_phones;
      this.add_on_analytic = responseData.add_on_analytic;
      this.add_on_verification = responseData.add_on_verification;
      this.pozative_Only_Monthly = responseData.pozative_Only_Monthly;
      this.pozative_Only_Annually = responseData.pozative_Only_Annually;
      this.verifications_Only_Monthly = responseData.verifications_Only_Monthly;
      this.verifications_Only_Annually = responseData.verifications_Only_Annually;
      this.hardwareCreditAnnually = responseData.hardwareCreditAnnually;
      this.hardwareCreditMonthly = responseData.hardwareCreditMonthly;
      // console.log('Hardwaeresersdfsdfsdfsdf', this.hardwareCreditAnnually,this.hardwareCreditMonthly);
      const responsefileData = responseData.fileData; // Assuming this is the key in the response
      
      // Check if responsefileData is an array and has data
      if (responsefileData && Array.isArray(responsefileData)) {
        // Clear existing locations
        this.locations.clear();

        // Iterate over the response data and add form groups
        responsefileData.forEach((data: any, index: number) => {
          const locationGroup = this.fb.group({
            practice_name: [data['Practice Name'] || '', Validators.required],
            location_name: [
              data['Location Short Name'] || '',
              Validators.required,
            ],
            practiceAdressLine_1: [
              data['Practice Address Line 1'] || '',
              Validators.required,
            ],
            practiceAdressLine_2: [data['Practice Address Line 2'] || ''],
            practice_city: [data['City'] || '', Validators.required],
            practice_state: [data['State'] || '', Validators.required],
            practice_postal_zip_code: [
              data['Zip Code']?.toString() || '',
              Validators.required,
            ],
            practice_country: [data['Country'] || '', Validators.required],
            practice_timezone: [data['Timezone'] || '', Validators.required],
            practice_office_phone: [
              data['Office Phone'] || '',
              Validators.required,
            ],
            practice_email: [data['Email'] || '', Validators.required],
            practice_website_url: [data['Website'] || ''],
            practice_management_software: [
              data['practice_ehr'] || '',
              Validators.required,
            ],
            practice_poc: [data['POC Name'] || '', Validators.required],
            practice_poc_email: [data['POC Email'] || '',
             Validators.required],
            practice_poc_work_number: [
              data['POC Work Number'] || '',
              Validators.required,
            ],
            practice_poc_cell_number: [
              data['POC Cell Number'] || '',
              Validators.required,
            ],
          });
          this.locations.push(locationGroup);
        });

        // Trigger change detection
        setTimeout(() => {
          this.locations.updateValueAndValidity();
        });
        this.expandForm = true;
      }
      // Check if responseData is an object and has practiceData property
      if (
        responseData.practiceData &&
        Array.isArray(responseData.practiceData) &&
        responseData.practiceData.length > 0
      ) {
        this.locations.clear();
        this.locationId = responseData.practiceData.map((data: any) => data.locationId);
        // Only expand the form if at least one location has a practiceName with a value
        const hasValidPracticeName = responseData.practiceData.some(
          (data: any) => data.practiceName != null && data.practiceName !== ''
        );
        
        this.expandForm = hasValidPracticeName;
        this.checkConditionForHardware = hasValidPracticeName;
        this.expandReview = hasValidPracticeName;
        this.practiceDataArray = responseData.practiceData;
        responseData.practiceData.forEach((data: any, index: number) => {
          const locationGroup = this.fb.group({
            practice_name: [data.practiceName || '', Validators.required],
            location_name: [data.locationName || '', Validators.required],
            practiceAdressLine_1: [
              data.practiceAdressLine1 || '',
              Validators.required,
            ],
            practiceAdressLine_2: [data.practiceAdressLine2 || ''],
            practice_city: [data.practiceCity || '', Validators.required],
            practice_state: [data.practiceState || '', Validators.required],
            practice_postal_zip_code: [
              data.practicePostalZipCode || '',
              Validators.required,
            ],
            practice_country: [data.practiceCountry || '', Validators.required],
            practice_timezone: [
              data.practiceTimezone || '',
              Validators.required,
            ],
            practice_office_phone: [
              data.practiceOfficePhone || '',
              Validators.required,
            ],
            practice_email: [data.practiceEmail || '', Validators.required],
            practice_website_url: [data.practiceWebsiteUrl || ''],
            practice_management_software: [
              data.practice_management_software || '',
              Validators.required,
            ], // No mapping in API, set as empty or map if available
            practice_poc: [data.practicePoc || '', Validators.required],
            practice_poc_email: [
              data.practicePocEmail || '',
              Validators.required,
            ],
            practice_poc_work_number: [
              data.practicePocWorkNumber || '',
              Validators.required,
            ],
            practice_poc_cell_number: [
              data.practicePocCellNumber || '',
              Validators.required,
            ],
          });
          
          // Only add location if there's valid data
          this.locations.push(locationGroup);
        });

        setTimeout(() => {
          this.locations.updateValueAndValidity();
        });
      setTimeout(() => {
        if (this.signatureCanvas && this.signatureCanvas.nativeElement) {
          this.signaturePad = new SignaturePad(
            this.signatureCanvas.nativeElement,
            {
              backgroundColor: 'white',
              penColor: 'black',
            }
          );
          this.resizeCanvas();
        }
      }, 200);
        if(responseData.signatory_name || responseData.signature_url) {
          // Store the signature data from the API
          if(responseData.signatory_name) {
            this.signature_name = responseData.signatory_name;
          }
          
          if(responseData.signature_url) {
            this.signature_url = responseData.signature_url;
          }

          setTimeout(() => {
            if (this.signatureCanvas && this.signatureCanvas.nativeElement) {
              this.signaturePad = new SignaturePad(
                this.signatureCanvas.nativeElement,
                {
                  backgroundColor: 'white',
                  penColor: 'black',
                }
              );
              
              this.resizeCanvas();
              
              // After initialization, load the signature from URL if available
              if (this.signature_url) {
                const img = new Image();
                img.src = this.signature_url;
                this.signatureExists=true
              }
            }
          }, 200);
        }
      }

      if (responseData.selectPhone != null) {
        this.selectPhone = responseData.selectPhone;
        this.expandHardware=true
        this.expandForm=true
      }
      if (responseData.selectTerminal != null) {
        this.selectTerminal = responseData.selectTerminal;
        this.expandHardware=true
        this.expandForm=true
      }

      if (
        responseData.practiceData &&
        Array.isArray(responseData.practiceData) &&
        responseData.practiceData.length > 0 &&
        responseData.practiceData[0].selectedPackageName
      ) {
        // Check if promotion type is "No Vendor Promo" and prioritize it
        if (responseData.sales_person_promotion_type === 'No Vendor Promo') {
          this.selectedPackageName = this.whichPackageToShow = responseData.sales_person_promotion_type;
          
        } else {
          this.selectedPackageName = this.whichPackageToShow = responseData.practiceData[0].selectedPackageName;
        }
         this.calculateSubscriptionPrices()
        this.expandHardware = true;
         this.showPaymentcard=true
        console.log(this.whichPackageToShow, 'selectedPackageName');
        
        if (this.selectedPackageName == 'Adit Lite') {
          this.ifPackageAditLite = true;
          this.showSelection_of_phone = false;
        }
      } else {
        if (responseData.sales_person_promotion_type == '') {
          this.showOnlyTechStack = true;
        }
        this.whichPackageToShow = responseData.sales_person_promotion_type;
      }
      
      if (responseData.displayTechStackComparison == false) {
        this.showtechStackGap = false;
      } else {
        this.showtechStackGap = true;
         let featuresArray:any[]=[]
        // if(responseData.techStackData.length>0){
        featuresArray = responseData.techStackData.features;
         this.totalCost= responseData.techStackData.tech_stack_total_prices;
        // }
      
       
        console.log(featuresArray, 'featuresArray', communicationsList);
        this.updateArrayWithFeatures(this.communicationsList, featuresArray);
      }
    if(responseData.hardwareOrders && responseData.hardwareOrders.length > 0) {
      // Initialize the default hardware counts if not already done
      if (!this.hardware_counts) {
        this.initializeHardwareCounts();
      }
      
      // Reset phone and terminal counts to zero first
      this.counts_for_phone = [2, 0, 0, 0, 0, 0]; // Reset all phone counts
      this.counts_for_terminal = [0, 0]; // Reset all terminal counts
      
      // Set the selectPhone and selectTerminal flags to true if any hardware is ordered
      const hasPhones = responseData.hardwareOrders.some((order:any) => 
        ['Grandstream GRP 2616', 'Grandstream GRP 2613', 'Grandstream DP 720', 
         'GRP 2616 Wall Mount', 'GRP 2613 Wall Mount', 'Headset + Adapter'].includes(order.hardwareName));
      
      const hasTerminals = responseData.hardwareOrders.some((order:any) => 
        ['BBPOS WisePOS E', 'BBPOS WisePOS E Dock'].includes(order.hardwareName));
      
      this.selectPhone = hasPhones;
      this.selectTerminal = hasTerminals;
      
      // Process each hardware order
      // responseData.hardwareOrders.forEach((order:any) => {
      //   const hardwareName = order.hardwareName;
      //   const count = order.count;
        
      //   // Map hardware name to the appropriate index in counts arrays
      //   switch (hardwareName) {
      //     case 'Grandstream GRP 2616':
      //       this.counts_for_phone[0] = count;
      //       break;
      //     case 'Grandstream GRP 2613':
      //       this.counts_for_phone[1] = count;
      //       break;
      //     case 'Grandstream DP 720':
      //       this.counts_for_phone[2] = count;
      //       break;
      //     case 'GRP 2616 Wall Mount':
      //       this.counts_for_phone[3] = count;
      //       break;
      //     case 'GRP 2613 Wall Mount':
      //       this.counts_for_phone[4] = count;
      //       break;
      //     case 'Headset + Adapter':
      //       this.counts_for_phone[5] = count;
      //       break;
      //     case 'BBPOS WisePOS E':
      //       this.counts_for_terminal[0] = count;
      //       break;
      //     case 'BBPOS WisePOS E Dock':
      //       this.counts_for_terminal[1] = count;
      //       break;
      //   }
      // });
         this.calculateTotalPrice();
     
      // If this is a single location, also update the checkConditionForHardware
      if (this.multiple_location === 'no' && hasPhones) {
        this.checkConditionForHardware = true;
      }
      
      // Force the hardware section to be expanded
      this.expandHardware = true;
      this.showPaymentcard=true
    }
    if(responseData.priceAddons) {
        const priceAddons = responseData.priceAddons || {};
        // const locationName = this.locations.at(0)?.get('location_name')?.value || 'Location 1';
        // const addons = priceAddons[locationName] || {};

        // Set addon actives based on "Yes"/"No" values
        this.phoneActive = this.addOnPhone = priceAddons.phone_show === 'Yes';
        this.analyticActive = this.addOnAnalytic = priceAddons.analytics_show === 'Yes';
        this.verificationActive = this.addOnVerification = priceAddons.verification_show === 'Yes';
    }
    // Replace the old hardwareOrders logic with locationOrders

    if (responseData.practiceData[0].locationOrders && responseData.practiceData[0].locationOrders.length > 0) {
      // Initialize the default hardware counts if not already done
      if (!this.hardware_counts) {
        this.initializeHardwareCounts();
      }
  
      // Reset phone and terminal counts to zero first
      this.counts_for_phone = [2, 0, 0, 0, 0, 0]; // Reset all phone counts
      this.counts_for_terminal = [0, 0]; // Reset all terminal counts
  
      // Set the selectPhone and selectTerminal flags to true if any hardware is ordered
      const hasPhones = responseData.practiceData[0].locationOrders.some((order: any) =>
        (order.grandstream_grp2616_qty > 0) ||
        (order.grandstream_grp2613_qty > 0) ||
        (order.grandstream_dp720_qty > 0) ||
        (order.grp_2616_wall_mount_qty > 0) ||
        (order.grp_2613_wall_mount_qty > 0) ||
        (order.headset_adapter_qty > 0)
      );

      const hasTerminals = responseData.practiceData[0].locationOrders.some((order: any) =>
        (order.bbpos_wispos_qty > 0) ||
        (order.bbpos_edock_qty > 0)
      );
  
      this.selectPhone = hasPhones;
      this.selectTerminal = hasTerminals;
  
      // Process each location order (assuming single location for counts arrays)
      // If you have multiple locations, you may want to loop and store per-location counts
      const order = responseData.practiceData[0].locationOrders[0];
              console.log(order, 'Terminal Counts');

      if (order) {
        this.counts_for_phone[0] = Number(order.grandstream_grp2616_qty) || 0;
        this.counts_for_phone[1] = Number(order.grandstream_grp2613_qty) || 0;
        this.counts_for_phone[2] = Number(order.grandstream_dp720_qty) || 0;
        this.counts_for_phone[3] = Number(order.grp_2616_wall_mount_qty) || 0;
        this.counts_for_phone[4] = Number(order.grp_2613_wall_mount_qty) || 0;
        this.counts_for_phone[5] = Number(order.headset_adapter_qty) || 0;
  
        this.counts_for_terminal[0] = Number(order.bbpos_wispos_qty) || 0;
        this.counts_for_terminal[1] = Number(order.bbpos_edock_qty) || 0;
      }
  
      this.calculateTotalPrice();
  
      // If this is a single location, also update the checkConditionForHardware
      if (this.multiple_location === 'no' && hasPhones) {
        this.checkConditionForHardware = true;
      }
      
      // Force the hardware section to be expanded
      this.expandHardware = true;
      this.showPaymentcard = true;
    }
  
    });

    this.activatePricingForharware();
  }

  // Add this method to initialize hardware_counts properly
  initializeHardwareCounts() {
    // Clear the array
    this.hardware_counts =  this.hardwareService.initializeHardwareCounts(
      this.locations.length,
      this.hardwarePrices)
  }

  selectedPackageName: string = '';
calculateSubscriptionPrices() {
  
  // Reset prices
  this.subscriptionPriceAnnually = 0;
  this.subscriptionPriceMonthly = 0;
  
  if (!this.selectedPackageName) return;

  // Calculate based on the selected package
  switch (this.selectedPackageName) {
    case 'Tech Bundle':
      this.subscriptionPriceAnnually = Number(this.techAnnual_Disc || 0);
      this.subscriptionPriceMonthly = Number(this.techMonthly_Disc || 0);
      break;
    case 'Analytic Bundle':
      this.subscriptionPriceAnnually = Number(this.analyticAnnual_Disc || 0);
      this.subscriptionPriceMonthly = Number(this.analyticMonthly_Disc || 0);
      break;
    case 'Adit Core':
      this.subscriptionPriceAnnually = Number(this.aditCore_annually || 0);
      this.subscriptionPriceMonthly = Number(this.aditCore_monthly || 0);
      break;
    case 'Adit Lite':
      this.subscriptionPriceAnnually = Number(this.aditLiteAnnual_Disc || 0);
      this.subscriptionPriceMonthly = Number(this.aditLiteMontly_Disc || 0);
      break;
    case 'Pozative':
      this.subscriptionPriceAnnually = Number(this.pozative_Only_Annually || 0);
      this.subscriptionPriceMonthly = Number(this.pozative_Only_Monthly || 0);
      break;
    case 'Verification':
      this.subscriptionPriceAnnually = Number(this.verifications_Only_Annually || 0);
      this.subscriptionPriceMonthly = Number(this.verifications_Only_Monthly || 0);
      break;
    case 'No Vendor Promo':
      // For No Vendor Promo, sum all the active components
      let annualTotal = 0;
      let monthlyTotal = 0;
      
      // Check if Adit Core is active
      if (this.ifPackageisAditCore === false) {
        annualTotal += Number(this.aditCore_annually || 0);
        monthlyTotal += Number(this.aditCore_monthly || 0);
      }
      
      // Check if Pozative is active
      if (this.pozativeSelectedChange === false) {
        annualTotal += Number(this.pozative_Only_Annually || 0);
        monthlyTotal += Number(this.pozative_Only_Monthly || 0);
      }
      
      // Check if Verification is active
      if (this.verificationActive === false) {
        annualTotal += Number(this.verifications_Only_Annually || 0);
        monthlyTotal += Number(this.verifications_Only_Monthly || 0);
      }
      
      this.subscriptionPriceAnnually = annualTotal;
      this.subscriptionPriceMonthly = monthlyTotal;
      break;
  }
  
  // Add add-on prices if they're enabled
  if (this.addOnPhone) {
    this.subscriptionPriceAnnually += Number(this.add_on_phones || 0);
    this.subscriptionPriceMonthly += Number(this.add_on_phones || 0);
  }
  
  if (this.addOnAnalytic) {
    this.subscriptionPriceAnnually += Number(this.add_on_analytic || 0);
    this.subscriptionPriceMonthly += Number(this.add_on_analytic || 0);
  }
  
  if (this.addOnVerification) {
    this.subscriptionPriceAnnually += Number(this.add_on_verification || 0);
    this.subscriptionPriceMonthly += Number(this.add_on_verification || 0);
  }
  
  // Update the total values
  this.totalAnnually = this.subscriptionPriceAnnually;
  this.totalMonthly = this.subscriptionPriceMonthly;
  if(this.totalAnnually>0||this.totalMonthly>0){                      
  this.showPaymentcard=true
  }
}
originaHardwarePriceAnnually: number = 0;
originaHardwarePriceMonthly: number = 0;
  onPackageSelectedChange(selected: string) {
    console.log(selected, 'selected');
    this.selectedPackageName = selected;
    if(selected=='aditLite'){
      this.originaHardwarePriceMonthly=this.hardwareCreditMonthly
      this.originaHardwarePriceAnnually=this.hardwareCreditAnnually
      if(this.hardwareCreditAnnually){
        this.hardwareCreditAnnually=0
      }
      if(this.hardwareCreditMonthly){
        this.hardwareCreditMonthly=0
      }
    }else{
      if(this.originaHardwarePriceAnnually==0 && this.originaHardwarePriceMonthly==0){
        this.originaHardwarePriceAnnually = this.hardwareCreditAnnually;
        this.originaHardwarePriceMonthly = this.hardwareCreditMonthly;
      }
      this.hardwareCreditAnnually = this.originaHardwarePriceAnnually;
      this.hardwareCreditMonthly = this.originaHardwarePriceMonthly;
    }
    // Add this at the end of the method
  }
  onPozativeSelectedChange(event: any) {
    // console.log(event, 'selected');
    this.pozativeSelectedChange = event 
    if(event ==true){
      this.selectedPackageName = 'Pozative';
    }
  }
  updateArrayWithFeatures(
    array: { text: string; value: boolean }[],
    featuresArray: string[]
  ) {
    array.forEach((item) => {
      if (featuresArray.includes(item.text)) {
        item.value = false;
      }
    });
  }
  // Getter for the locations FormArray
  get locations(): FormArray {
    return this.practiceData.get('locations') as FormArray;
  }


  // Method to create a location form group
  createLocationGroup(): FormGroup {
     const group =  this.fb.group({
      practice_name: ['', Validators.required],
      location_name: ['', Validators.required],
      practiceAdressLine_1: ['', Validators.required],
      practiceAdressLine_2: [''],
      practice_city: ['', Validators.required],
      practice_state: ['', Validators.required],
      practice_postal_zip_code: ['', Validators.required],
      practice_country: ['', Validators.required],
      practice_timezone: ['', Validators.required],
      practice_office_phone: ['', Validators.required],
      practice_email: ['', [Validators.required]],
      practice_management_software: ['', Validators.required],
      practice_poc: ['', Validators.required],
      practice_poc_email: ['', Validators.required],
      practice_poc_work_number: ['', Validators.required],
      practice_poc_cell_number: ['', Validators.required],
    });
     group.get('practice_country')?.valueChanges.subscribe((country) => {
    const zipControl = group.get('practice_postal_zip_code');
    if (!zipControl) return;

    zipControl.clearValidators();

    if (country === 'UnitedStates') {
      zipControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{5}(-\d{4})?$/)
      ]);
    } else if (country === 'Canada') {
      zipControl.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
      ]);
    } else {
      zipControl.setValidators(Validators.required);
    }

    zipControl.updateValueAndValidity();
  });

  return group;
  }

  onSubmit() {
    console.log(this.practiceData.value, 'Form Data');
    let formData: {
      locationId?: any[];
      signature_url?: string;
      signatory_name?: any;
      practice_data?: any;
      shipping_address_is_same_or_not?: any;
      shipping_addresses?: any[];
      organization_name?: any;
      organization_poc_name?: any;
      organization_poc_email?: any;
      organization_poc_work_number?: any;
      organization_poc_cell_number?: any;
      hardware_inventory?: any;
      selectedPackageName?: any;
      selectPhone?: any;
      selectTerminal?: any;
      isAnnually?: string;
      aditCore?: any;
      uploaded_image?: string; // Add this field for the uploaded image
      activation_fee?: number;
      subscription_fee?: number;
      hardware_total?: number;
      priceAddons?: {
        [locationName: string]: {
          phone_show?: string;
          phone_orginal_price?: string;
          phone_discnt_price?: string;
          analytics_show?: string;
          analytics_orginal_price?: string;
          analytics_discnt_price?: string;
          verification_show?: string;
          verification_orginal_price?: string;
          verification_discnt_price?: string;
          allow_adit_core_only?: number;
        };
      };
    } = {
      isAnnually: this.isAnnually ? 'Annually' : 'Monthly',
      priceAddons: {},
      locationId: this.locationId,
    };

    // Include the uploaded image if available
    if (this.previewImage) {
      // If it's already a string (base64), use it directly
      if (typeof this.previewImage === 'string') {
        formData.uploaded_image = this.previewImage;
      } 
      // If it's an ArrayBuffer, convert it to base64
      else if (this.previewImage instanceof ArrayBuffer) {
        const binary = Array.from(new Uint8Array(this.previewImage))
          .map(b => String.fromCharCode(b))
          .join('');
        formData.uploaded_image = 'data:image/jpeg;base64,' + btoa(binary);
      }
    }

    // Add activation fee
    if (this.activation_fee) {
      formData.activation_fee = Number(this.activation_fee);
    }

    // Add subscription fee based on annual/monthly selection
    if (this.isAnnually) {
      formData.subscription_fee = this.subscriptionPriceAnnually*12 || 0;
    } else {
      formData.subscription_fee = this.subscriptionPriceMonthly || 0;
    }

    // Add hardware total
    if (this.selectPhone || this.selectTerminal) {
      formData.hardware_total = this.hardware_TotalFor_Singlecoation || 0;
    } else {
      formData.hardware_total = 0;
    }

    if(this.whichPackageToShow=='No Vendor Promo'){
      console.log('No Vendor Promo selected');
      console.log(this.selectedPackageName, 'selectedPackageName');
      console.log(this.pozativeSelectedChange, 'ifPackageisAditCore');
      console.log(this.ifPackageAditLite, 'ifPackageAditLite');
    }
  
      // For single location, create a simpler hardware inventory object
      if (this.selectPhone || this.selectTerminal) {
        formData.hardware_inventory = this.getLocationHardwarePayload(0);
        console.log(formData.hardware_inventory.package_type, 'hardware_inventory');
      }
    
  // For single location, create a simple priceAddons entry
  if (this.multiple_location === 'no') {
    const locationName = this.locations.at(0)?.get('location_name')?.value || 'Location 1';
    
    formData.priceAddons = formData.priceAddons || {};
    formData.priceAddons[locationName] = {
      phone_show: this.addOnPhone ? 'Yes' : 'No',
      phone_orginal_price: this.add_on_phones || '',
      phone_discnt_price: this.add_on_phones || '',
      analytics_show: this.addOnAnalytic ? 'Yes' : 'No',
      analytics_orginal_price: this.add_on_analytic || '',
      analytics_discnt_price: this.add_on_analytic || '',
      verification_show: this.addOnVerification ? 'Yes' : 'No',
      verification_orginal_price: this.add_on_verification || '',
      verification_discnt_price: this.add_on_verification || '',
      allow_adit_core_only: this.ifPackageisAditCore ? 1 : 0
    };
  }


    // Add shipping address data based on multiple location setting
      if(this.selectedPackageName){
        formData.selectedPackageName = this.selectedPackageName;
      } 
      formData.shipping_address_is_same_or_not = this.sameAsPracticeAddress;
      if(this.shippingAddressForm.valid){
        formData.shipping_addresses = this.shippingAddressForm.value;
      }
      if(this.selectTerminal!=null){
        formData.selectTerminal = this.selectTerminal;
      }
      if(this.selectPhone!=null){
        formData.selectPhone = this.selectPhone;
      }
      if(this.practiceData.valid){
        formData.practice_data = this.practiceData.value;
      }else{
        if(this.practiceDataArray.length>0){
           formData.practice_data = {'locations': this.practiceDataArray};
        }else{
          formData.practice_data = {'locations':[{}]}
        }
      }

    if(this.signature_url){
      formData.signature_url = this.signature_url;
    }else if(this.signaturePad){
      if(!this.signaturePad.isEmpty()) {
      formData.signature_url = this.signaturePad.toDataURL(); // Get base64 image
      }
      } else {
        console.warn('No signature to save!');
      }
    
    if(this.signature_name){
      formData.signatory_name = this.signature_name;
    }
    console.log(formData);
    this.agreementService.add_practice_data(formData, this.agreementId).subscribe({
      next: (res) => {
        console.log(res);
        if(res.locationId!=''){
          this.locationId=res.locationId
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  showTable: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      // Check if the canvas element exists before creating SignaturePad
      if (this.signatureCanvas && this.signatureCanvas.nativeElement) {
        this.signaturePad = new SignaturePad(
          this.signatureCanvas.nativeElement,
          {
            backgroundColor: 'white',
            penColor: 'black',
          }
        );

        this.resizeCanvas();

        // Load signature if available
        if (this.signature_url) {
          this.signaturePad.fromDataURL(this.signature_url);
        }
      } else {
        console.warn(
          'Signature canvas element is not available. It might be conditionally hidden in the template.'
        );
      }
    });
    // setTimeout(() => {
    //   this.showTable = true;
    //   this.activatePricingForharware();
    // }, 1000);
    //     setTimeout(() => {
    //   this.initializeAllAutocomplete();
     
    // }, 100);
  }
  //google map address setup
    // @ViewChild('practiceNameInput') practiceNameInput!: ElementRef;
    //   @ViewChild('practiceNameInput') practiceNameInputs!: QueryList<ElementRef>;
  private autocompleteInstances: any[] = [];
  // private autocomplete: any;
  // private currentPlaceId: string = '';
  // private gmbName: string = '';
  // private gmbAddress: string = '';
  // private gmbRating: number = 0;
  // private gmbReviews: number = 0;
  // private gmbWebsite: string = '';
//   private checkGoogleMapsReady(): boolean {
//   return typeof google !== 'undefined' && google.maps && google.maps.places;
// }
  //   private initializeAllAutocomplete() {
  //   // Initialize autocomplete for all existing practice name inputs
  //   this.practiceNameInputs.forEach((inputRef, index) => {
  //     this.initAutocompleteForInput(inputRef, index);
  //   });
  // }
  // private initAutocompleteForInput(inputRef: ElementRef, index: number) {
  //   if (!inputRef || !inputRef.nativeElement) {
  //     console.error('Input element not found for index:', index);
  //     return;
  //   }

  //   const input = inputRef.nativeElement;
    
  //   // Check if input is actually an HTMLInputElement
  //   if (!(input instanceof HTMLInputElement)) {
  //     console.error('Element is not an HTMLInputElement:', input);
  //     return;
  //   }

  //   try {
  //     const autocomplete = new google.maps.places.Autocomplete(input);
      
  //     // Set component restrictions to US and Canada
  //     autocomplete.setComponentRestrictions({'country': ['us', 'ca']});
      
  //     // Store the autocomplete instance
  //     this.autocompleteInstances[index] = autocomplete;
      
  //     // Add listener for place changed event
  //     autocomplete.addListener('place_changed', () => {
  //       this.handlePlaceChanged(index, autocomplete);
  //     });
  //   } catch (error) {
  //     console.error('Error initializing autocomplete:', error);
  //   }
  // }
// private handlePlaceChanged(index: number, autocomplete: any) {
//     const place = autocomplete.getPlace();
    
//     if (!place || !place.place_id) {
//       return;
//     }

//     // Get the specific location form group
//     const locationFormGroup = this.locations.at(index) as FormGroup;
//     this.updateLocationFormGroup(locationFormGroup, place);
//   }
  // Method to initialize autocomplete for a specific location index
  initAutocompleteForLocation(index: number, inputElement:any) {
    console.log(inputElement);
    const input = inputElement.nativeElement;
    
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions({'country': ['us', 'ca']});
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place || !place.place_id) {
        return;
      }
      
      const locationFormGroup = this.locations.at(index) as FormGroup;
      this.updateLocationFormGroup(locationFormGroup, place);
    });
  }
  private updateLocationFormGroup(locationFormGroup: FormGroup, place: any) {
    // Extract place information
    const placeId = place.place_id;
    const name = place.name || '';
    const address = place.formatted_address || '';
    const rating = place.rating || 0;
    const reviews = place.user_ratings_total || 0;
    let website = place.website || '';
    
    // Clean website URL
    if (website !== '') {
      const queryIndex = website.indexOf('?');
      if (queryIndex !== -1) {
        website = website.substring(0, queryIndex);
      }
    }
    
    // Update basic fields
    locationFormGroup.patchValue({
      practice_name: name,
      website_url: website,
      practice_phone: place.formatted_phone_number || ''
    });
    
    // Parse address components
    let address1 = '';
    
    if (place.address_components) {
      for (const component of place.address_components) {
        const addressType = component.types[0];
        
        switch (addressType) {
          case 'locality':
            const city = component.long_name;
            locationFormGroup.patchValue({
              practice_city: city,
              location_name: city
            });
            break;
            
          case 'administrative_area_level_1':
            locationFormGroup.patchValue({
              practice_state: component.long_name
            });
            break;
            
          case 'street_number':
            address1 += component.long_name;
            break;
            
          case 'route':
            address1 = address1 + ' ' + component.long_name;
            break;
            
          case 'subpremise':
            locationFormGroup.patchValue({
              practice_address2: component.long_name
            });
            break;
            
          case 'postal_code':
            locationFormGroup.patchValue({
              practice_zip: component.short_name
            });
            break;
            
          case 'country':
            locationFormGroup.patchValue({
              practice_country: component.short_name
            });
            break;
        }
      }
    }
    
    // Set the constructed address
    locationFormGroup.patchValue({
      practice_address1: address1.trim()
    });
    
    // Get coordinates
    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      locationFormGroup.patchValue({
        searchLocation_lat: lat,
        searchLocation_lng: lng
      });
    }
    
    // Set Google My Business data
    locationFormGroup.patchValue({
      current_place_id: placeId,
      gmb_name: name,
      gmb_rating: rating,
      gmb_reviews: reviews,
      gmb_address: address
    });
  }
ngOnDestroy() {
  this.autocompleteInstances.forEach(instance => {
    if (instance) {
      google.maps.event.clearInstanceListeners(instance);
    }
  });
}
  private resizeCanvas() {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) return; // Guard clause to prevent errors

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.signaturePad?.clear(); // Add optional chaining here too

    if (this.signature_url && this.signaturePad) {
      this.signaturePad.fromDataURL(this.signature_url);
    }
  }

  clearPad() {
    this.signaturePad.clear();
    this.signatureExists = false;
    this.signature_url = '';
  }

  name_of_phone: string[] = [
    'Grandstream GRP 2616',
    'Grandstream GRP 2613',
    'Grandstream DP 720',
    'GRP 2616 Wall Mount',
    'GRP 2613 Wall Mount',
    'Headset + Adapter',
  ];
  counts_for_phone: number[] = [2, 0, 0, 0, 0, 0]; // Default count for GRP 2616 is set to 2
  counts_for_terminal: number[] = [0, 0]; // Default count for terminals
  // counts: number[] = [2, 0, 0, 0, 0, 0]; // Default count for GRP 2616 is set to 2
  setCountTo1ForChiro:boolean=false 
  // get counts(): number[] {
  // return this.setCountTo1ForChiro ? [1, 0, 0, 0, 0, 0] : [2, 0, 0, 0, 0, 0];
// }
  prices_for_phone: number[] = [150, 100, 100, 10, 10, 275]; // Prices for each hardware item
  prices_for_terminal: number[] = [250, 49]; // Prices for each hardware item
  totalPrice_for_phone: number = 0;
  totalPrice_for_terminal: number = 0;
  increment(index: number, isPhone: boolean): void {
    if (isPhone) {
      this.counts_for_phone[index]++;
      this.calculateTotalPrice();
    } else {
      this.counts_for_terminal[index]++;
      this.calculateTotalPrice();
    }
  }

  decrement(index: number, isPhone: boolean): void {
    if (isPhone) {
      if(this.setCountTo1ForChiro){
          if (index === 0 && this.counts_for_phone[index] <= 1) {
          return; // Prevent decrementing below 1 for index 0
        }
      }else{
         if (index === 0 && this.counts_for_phone[index] <= 2) {
        return; // Prevent decrementing below 2 for index 0
      }
      }
     
      if (this.counts_for_phone[index] > 0) {
        this.counts_for_phone[index]--;
        this.calculateTotalPrice();
      }
    } else {
      if (this.counts_for_terminal[index] > 0) {
        this.counts_for_terminal[index]--;
        this.calculateTotalPrice();
      }
    }
  }

  calculateTotalPrice(): void {
    if (this.selectPhone == true) {
      this.totalPrice_for_phone = this.counts_for_phone.reduce(
        (sum, count, index) => sum + count * this.prices_for_phone[index],
        0
      );

    }else if(this.selectPhone == false){
      this.totalPrice_for_phone = 0;
    }
    if (this.selectTerminal == true) {
      this.totalPrice_for_terminal = this.counts_for_terminal.reduce(
        (sum, count, index) => sum + count * this.prices_for_terminal[index],
        0
      );
    }else if(this.selectTerminal == false){
      this.totalPrice_for_terminal = 0;
    }

    // Instead, directly calculate hardware total here
    this.hardware_TotalFor_Singlecoation =
      this.totalPrice_for_phone + this.totalPrice_for_terminal;
  }

  calculateHardwareTotalFroSinglecoation() {
    this.hardware_TotalFor_Singlecoation =
      this.totalPrice_for_phone + this.totalPrice_for_terminal;
  }

  removeValue_of_hardware() {
    if (this.selectPhone == false) {
      if (this.totalPrice_for_phone >= 300) {
        this.totalPrice_for_phone = this.totalPrice_for_phone - 300;
      }
      this.counts_for_phone = [2, 0, 0, 0, 0, 0];
      this.totalPrice_for_phone = this.counts_for_phone.reduce(
        (sum, count, index) => sum + count * this.prices_for_phone[index],
        0
      );

      this.calculateTotalPrice();
    }
    if (this.selectTerminal == false) {
      this.counts_for_terminal = [0, 0];
      this.totalPrice_for_terminal = this.counts_for_terminal.reduce(
        (sum, count, index) => sum + count * this.prices_for_terminal[index],
        0
      );

      this.calculateTotalPrice();
    }
    this.calculateHardwareTotalFroSinglecoation();
  }
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
  }

  previewImage: string | ArrayBuffer | null = null;

  // Drag Over
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drag Leave
  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  // Drop File
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  // File Selected
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.handleFile(target.files[0]);
    }
  }

  // Handle File
  private handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    } else {
      alert('Only image files are allowed!');
    }
  }

  editForm() {
    this.router.navigate(['/pre-agreement-form', this.agreementId]);
  }
  saveForm() {
    this.router.navigate(['/dashboard']);
  }

  subscriptionPlan_annually: any;
  subscriptionPlan_monthly: any;

  //table package change events
  choosedPackagesContent: string = '';

  // Initialize an array to store subscription prices for each location
  subscriptionPlans: { annually: number; monthly: number }[] = [];

  // Update the subscription plan when the package changes
  selectedPackage: string[] = [];
  onPackageChange(event: any, index: number) {
    const selectedPackage = event.target.value;
    this.selectedPackage[index] = selectedPackage;
    if (selectedPackage === 'tech') {
      this.subscriptionPlans[index] = {
        annually: Number(this.techAnnual_Disc) || 0,
        monthly: Number(this.techMonthly_Disc) || 0,
      };
    } else if (selectedPackage === 'analytic') {
      this.subscriptionPlans[index] = {
        annually: Number(this.analyticAnnual_Disc) || 0,
        monthly: Number(this.analyticMonthly_Disc) || 0,
      };
    } else if (selectedPackage === 'aditLite') {
      this.subscriptionPlans[index] = {
        annually: Number(this.aditLiteAnnual_Disc) || 0,
        monthly: Number(this.aditLiteMontly_Disc) || 0,
      };
    } else {
      this.subscriptionPlans[index] = { annually: 0, monthly: 0 }; // Default values
    }
    this.checkThePackage(selectedPackage);
    console.log(this.selectedPackage, 'selected package');
  }

  makeFirstLetterCapital(str: string): string {
    if (!str) return ''; // Return empty string if input is null/undefined
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // handling for multiple location hardware contents
  purchasePhones: boolean[] = [];
  purchaseTerminals: boolean[] = [];
  hardware_counts: { count: number; price: number }[][] = [];
  hardwarepurchasePrices: number[] = [];
  hardwarePrices: number[] = [150, 100, 100, 10, 10, 275, 250, 49];
  // Initialize an array to store extra hardware prices for each row
  extraharwarePrices: number[] = [];
  // counts: number[] = [2, 0, 0, 0, 0, 0]; // Default count for GRP 2616 is set to 2

  // Get the price of a specific hardware item
  getHardwarePrice(hardwareIndex: number): number {
    // const prices = [150, 100, 100, 10, 10, 275, 250, 49]; // Prices for each hardware item
    // return this.hardwarePrices[hardwareIndex] || 0;
    return this.hardwareService.getHardwarePrice(hardwareIndex);
  }

  calculateTotalHardwarePriceTotal(): number {
    let totalHardwarePrice = 0;
    for (
      let i = 0;
      i <
      Math.max(
        this.hardwarepurchasePrices.length,
        this.extraharwarePrices.length
      );
      i++
    ) {
      // Get hardwarepurchasePrice for this index (use 0 if undefined)
      const purchasePrice = this.hardwarepurchasePrices[i] || 0;

      // Get extraharwarePrice for this index (use 0 if undefined)
      const extraPrice = this.extraharwarePrices[i] || 0;
      totalHardwarePrice += Number(purchasePrice) + Number(extraPrice);
    }

 
    return totalHardwarePrice;
  }



  getTotal() {
    let total = 0;

    if (this.multiple_location === 'no') {
      if (this.isAnnually) {
        total =
          this.subscriptionPriceAnnually * 12 +
          parseInt(this.activation_fee, 10);
      } else {
        total = parseInt(this.activation_fee, 10);
      }

      // For single location, calculate hardware and credit difference
      let hardwareTotal =
        this.selectPhone || this.selectTerminal
          ? this.hardware_TotalFor_Singlecoation
          : 0;

      if (hardwareTotal > 0) {
        const hardwareCredit = this.isAnnually
          ? this.hardwareCreditAnnually
          : this.hardwareCreditMonthly;
        if (hardwareCredit) {
          // Calculate the effective hardware cost after credit
          const effectiveHardwareCost = Math.max(
            0,
            hardwareTotal - hardwareCredit
          );
          total += effectiveHardwareCost;
        } else {
          total += hardwareTotal;
        }
      }
    }
    return total || 0;
  }

  activatePricingForharware() {
    const defaultRowCount = this.locations?.controls?.length || 1; // Use 1 if no locations are added
    this.hardware_counts = Array(defaultRowCount)
      .fill(null)
      .map(() =>
        Array(this.hardwarePrices.length)
          .fill(null)
          .map((_, index) => ({
            count: index === 0 ? 2 : 0, // Set count to 2 for the first hardware item
            price: index === 0 ? 2 * this.getHardwarePrice(index) : 0, // Calculate price for the first hardware item
          }))
      );

    this.hardwarepurchasePrices = this.hardware_counts.map((row) =>
      row.reduce((total, hardware) => total + hardware.price, 0)
    );
    // Initialize extraharwarePrices with at least one default value
    this.extraharwarePrices = Array(defaultRowCount).fill(0);
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

  getNextPaymentDate(): string {
    const currentDate = new Date();
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

  //disable hardware phones if the pacakge is adit lite
  disablePhones: boolean = false;
  checkThePackage(event: any) {
    if (event === 'aditLite') {
      this.disablePhones = true;
    } else {
      this.disablePhones = false;
    }
  }
  hardware_TotalFor_Singlecoation: any;
  phoneActive: boolean = true;
  analyticActive: boolean = true;
  verificationActive: boolean = true;
  ifPackageisAditCore: boolean = false;
  ifPackageAditLite: boolean = false;
  showSelection_of_phone: boolean = true;

  onSelectedPhone(event: any) {
    this.showSelection_of_phone = event;
    this.phoneActive = event;
    this.selectPhone = event;
    this.addOnPhone = event;
    this.calculateTotalPrice()
    console.log(event, 'event of phone');
  }

  onSelectedAnalytics(event: any) {
    this.analyticActive = event;
    this.addOnAnalytic = event;
    console.log(event, 'event of analyticns');
  }

  onSelectedVerification(event: any) {
    this.verificationActive = event;
    this.addOnVerification = event;
    console.log(event, 'event of verification');
  }

  expandReview: boolean = false;
  expandHardware: boolean = false;
  expandForm: boolean = false;

  goToExpandForm() {
    if (this.addOnPhone == false) {
      // Only check terminal condition, not phone condition
      if (this.selectTerminal === false ) {
        this.expandForm = true;
      } else if (this.selectTerminal === true) {
        // Don't check for checkConditionForHardware when selectTerminal is true
        this.expandForm = true;
      } else {
        if(this.selectTerminal === null){
        alert('Select Yes or No for Terminal');
        }else{
        alert('Accept the conditions, check the checkbox');

        }
      }
    }
        // Special case for "Only Lite - 1st Yr Promo"
 
    else if (this.whichPackageToShow === 'Only Lite - 1st Yr Promo') {
      // Only check terminal condition, not phone condition
      if (this.selectTerminal === false || this.selectPhone === false||null) {
        this.expandForm = true;
      } else if (this.selectTerminal === true) {
        // Don't check for checkConditionForHardware when selectTerminal is true
        this.expandForm = true;
      } else {
        alert('Accept the conditions, check the checkbox');
      }
    } else {
      // Original logic for other package types
      if (this.selectPhone === false && this.selectTerminal === false) {
        this.expandForm = true;
      } else if (
        this.selectPhone === true &&
        this.checkConditionForHardware === true
      ) {
        // Only check checkConditionForHardware for phones
        this.expandForm = true;
      } else if (this.selectTerminal === true) {
        // Don't check checkConditionForHardware for terminals
        this.expandForm = true;
      } else {
        if(this.selectTerminal === null){
        alert('Select Yes or No for Terminal');
        }else{
        alert('Accept the conditions, check the checkbox');

        }
      }
    }
    this.onSubmit()
  }

  goNextToReview() {
    // Check if the practiceData form is valid
    if (this.practiceData.valid) {
      this.expandReview = true;

      // Initialize signature pad after DOM is updated
      setTimeout(() => {
        if (this.signatureCanvas && this.signatureCanvas.nativeElement) {
          this.signaturePad = new SignaturePad(
            this.signatureCanvas.nativeElement,
            {
              backgroundColor: 'white',
              penColor: 'black',
            }
          );
          this.resizeCanvas();
        }
      }, 200);
      this.onSubmit();
    } else {
      // Mark all form controls as touched to trigger validation errors
      this.markFormGroupTouched(this.practiceData);

      // Display an error message
      Swal.fire({
        icon: 'error',
        title: 'Form Validation Error',
        text: 'Please fill in all required fields before proceeding to review.',
        confirmButtonColor: '#3085d6',
      });

      // Scroll to the first invalid field
      this.scrollToFirstInvalidControl();
    }
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to scroll to the first invalid form field
  private scrollToFirstInvalidControl() {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }


  getLocationHardwareInventory(): {
    [locationId: string]: { [hardwareName: string]: number };
  } {
    const locationNames = this.locations.controls.map(
      (locationControl, index) =>
        locationControl.get('location_name')?.value || `Location ${index + 1}`
    );

    return this.hardwareService.calculateHardwareInventoryForLocation(
      this.purchasePhones,
      this.purchaseTerminals,
      this.hardware_counts,
      locationNames
    );
  }

  // add on calculations for no vendor promos

  onSelectedPhone_nvp(event: any) {
    this.selectedAddonPhone_nvp = event.selected;
    this.selectPhone = event.selected;
      this.phoneActive = event.selected;
    this.selectPhone = event.selected;
    this.addOnPhone = event.selected;
    this.calculateTotalPrice()
    console.log(event.selected, 'event of phone');
  }

  onSelectedAnalytics_nvp(event: any) {
    this.selectedAddonAnalytic_nvp = event.selected;
  }

  onSelectedVerification_nvp(event: any) {
    this.selectedAddonVerification_nvp = event.selected;
  }

  phoneAddOnPricesByLocation: boolean[] = [];
  analyticsAddOnPricesByLocation: boolean[] = [];
  verificationAddOnPricesByLocation: boolean[] = [];


  getHarwareCreditTotal() {
    const hardwareInventory = this.getLocationHardwareInventory();

    const locationsWithHardware = Object.keys(hardwareInventory).length;
    // console.log('locationsWithHardware', locationsWithHardware,hardwareInventory);
    // Calculate hardware credit based on number of locations with hardware
    const totalHardwareCredit =
      Number(
        this.isAnnually
          ? this.hardwareCreditAnnually
          : this.hardwareCreditMonthly
      ) * locationsWithHardware || 0;

    return totalHardwareCredit;
  }
  hardwareCreditDisplayValues: number[] = [];
  acceptTermsAndConditions: boolean = false;
  acceptEHRConditions: boolean = false;
  bothTermsAccepted: boolean = false;
updateTermsStatus(): void {
  if(this.acceptTermsAndConditions && this.acceptEHRConditions) {
    this.bothTermsAccepted = true;
  }
  else {
    this.bothTermsAccepted = false;
  }}


toggleEHRConditions(): void {
  this.acceptEHRConditions = !this.acceptEHRConditions;
  this.updateTermsStatus();
}


toggleTermsAndConditions(): void {
  this.acceptTermsAndConditions = !this.acceptTermsAndConditions;
  this.updateTermsStatus();
}

//multiple location objects to hide
hideAllcards: boolean = false;

//make payment code
expandPayment: boolean = false;

readonly dialog = inject(MatDialog);

openDialog(){
   console.log(this.practiceData.value, 'Form Data');
    let formData: {
      locationId?: any[];
      signature_url?: string;
      signatory_name?: any;
      practice_data?: any;
      shipping_address_is_same_or_not?: any;
      shipping_addresses?: any[];
      organization_name?: any;
      organization_poc_name?: any;
      organization_poc_email?: any;
      organization_poc_work_number?: any;
      organization_poc_cell_number?: any;
      hardware_inventory?: any;
      selectedPackageName?: any;
      selectPhone?: any;
      selectTerminal?: any;
      isAnnually?: string;
      aditCore?: any;
      uploaded_image?: string; // Add this field for the uploaded image
      activation_fee?: number;
      subscription_fee?: number;
      hardware_total?: number;
      multiple_location ?: boolean;
      priceAddons?: {
        [locationName: string]: {
          phone_show?: string;
          phone_orginal_price?: string;
          phone_discnt_price?: string;
          analytics_show?: string;
          analytics_orginal_price?: string;
          analytics_discnt_price?: string;
          verification_show?: string;
          verification_orginal_price?: string;
          verification_discnt_price?: string;
          allow_adit_core_only?: number;
        };
      };
      finalSubmission?:boolean;
    } = {
      isAnnually: this.isAnnually ? 'Annually' : 'Monthly',
      priceAddons: {},
      locationId: this.locationId,
      multiple_location:false
    };

    // Include the uploaded image if available
    if (this.previewImage) {
      // If it's already a string (base64), use it directly
      if (typeof this.previewImage === 'string') {
        formData.uploaded_image = this.previewImage;
      } 
      // If it's an ArrayBuffer, convert it to base64
      else if (this.previewImage instanceof ArrayBuffer) {
        const binary = Array.from(new Uint8Array(this.previewImage))
          .map(b => String.fromCharCode(b))
          .join('');
        formData.uploaded_image = 'data:image/jpeg;base64,' + btoa(binary);
      }
    }

    // Add activation fee
    if (this.activation_fee) {
      formData.activation_fee = Number(this.activation_fee);
    }

    // Add subscription fee based on annual/monthly selection
    if (this.isAnnually) {
      formData.subscription_fee = this.subscriptionPriceAnnually*12 || 0;
    } else {
      formData.subscription_fee = this.subscriptionPriceMonthly || 0;
    }

    // Add hardware total
    if (this.selectPhone || this.selectTerminal) {
      formData.hardware_total = this.hardware_TotalFor_Singlecoation || 0;
    } else {
      formData.hardware_total = 0;
    }

    if(this.whichPackageToShow=='No Vendor Promo'){
      console.log('No Vendor Promo selected');
      console.log(this.selectedPackageName, 'selectedPackageName');
      console.log(this.pozativeSelectedChange, 'ifPackageisAditCore');
      console.log(this.ifPackageAditLite, 'ifPackageAditLite');
    }
  
      // For single location, create a simpler hardware inventory object
      if (this.selectPhone || this.selectTerminal) {
        formData.hardware_inventory = this.getLocationHardwarePayload(0);
        console.log(formData.hardware_inventory.package_type, 'hardware_inventory');
      }
    
  // For single location, create a simple priceAddons entry
  if (this.multiple_location === 'no') {
    const locationName = this.locations.at(0)?.get('location_name')?.value || 'Location 1';
    
    formData.priceAddons = formData.priceAddons || {};
    formData.priceAddons[locationName] = {
      phone_show: this.addOnPhone ? 'Yes' : 'No',
      phone_orginal_price: this.add_on_phones || '',
      phone_discnt_price: this.add_on_phones || '',
      analytics_show: this.addOnAnalytic ? 'Yes' : 'No',
      analytics_orginal_price: this.add_on_analytic || '',
      analytics_discnt_price: this.add_on_analytic || '',
      verification_show: this.addOnVerification ? 'Yes' : 'No',
      verification_orginal_price: this.add_on_verification || '',
      verification_discnt_price: this.add_on_verification || '',
      allow_adit_core_only: this.ifPackageisAditCore ? 1 : 0
    };
  }


    // Add shipping address data based on multiple location setting
      if(this.selectedPackageName){
        formData.selectedPackageName = this.selectedPackageName;
      } 
      formData.shipping_address_is_same_or_not = this.sameAsPracticeAddress;
      if(this.shippingAddressForm.valid){
        formData.shipping_addresses = this.shippingAddressForm.value;
      }
      if(this.selectTerminal!=null){
        formData.selectTerminal = this.selectTerminal;
      }
      if(this.selectPhone!=null){
        formData.selectPhone = this.selectPhone;
      }
      if(this.practiceData.valid){
        formData.practice_data = this.practiceData.value;
      }else{
        if(this.practiceDataArray.length>0){
           formData.practice_data = {'locations': this.practiceDataArray};
        }else{
          formData.practice_data = {'locations':[{}]}
        }
      }

    if(this.signature_url){
      formData.signature_url = this.signature_url;
    }else if(this.signaturePad){
      if(!this.signaturePad.isEmpty()) {
      formData.signature_url = this.signaturePad.toDataURL(); // Get base64 image
      }
      } else {
        console.warn('No signature to save!');
      }
    
    if(this.signature_name){
      formData.signatory_name = this.signature_name;
    }
    formData.finalSubmission=true
    console.log(formData);
    this.agreementService.add_practice_data(formData, this.agreementId).subscribe({
      next: (res) => {
        console.log(res);
    
      if (res.missingFields && Array.isArray(res.missingFields)) {
        alert('Missing required fields:\n' + res.missingFields.join('\n'));
      } else if (res.message =="Practice data and hardware orders added successfully") {
        alert(res.message);
         let dialog =  this.dialog.open(CardDetailsComponent, {
          data:{locationId:this.locationId[0],agreementId:this.agreementId},
          maxWidth:'80vw',
          minWidth:'400px',
        });

        dialog.afterClosed().subscribe(result => {
          console.log(result)
        });
      } else {
         let dialog =  this.dialog.open(CardDetailsComponent, {
          data:{locationId:this.locationId[0],agreementId:this.agreementId},
          maxWidth:'80vw',
          minWidth:'400px',
        });

        dialog.afterClosed().subscribe(result => {
          console.log(result)
        });
      }
      },
      error: (err) => {
      console.log(err);
   
    }
    });

}

getLocationHardwarePayload(locationIndex: number): any {
  const locationControl = this.locations.at(locationIndex);
  const locationName = locationControl.get('location_name')?.value || `Location ${locationIndex + 1}`;

  // Phone and terminal counts
  const phoneCounts = this.counts_for_phone;
  const terminalCounts = this.counts_for_terminal;

  return {
    locationName: locationName,
    activation_fee: String(this.activation_fee ?? ''),
    subscription_fee: String(this.isAnnually ? this.subscriptionPriceAnnually*12 : this.subscriptionPriceMonthly),
    adit_voice_hardware: this.selectPhone ? 'Yes' : 'No',
    adit_pay_hardware: this.selectTerminal ? 'Yes' : 'No',
    billing_type: this.isAnnually ? 'Annually' : 'Monthly',
    package_type: this.returnPackageName(this.selectedPackageName) || '',
    grandstream_grp2616_qty: phoneCounts[0] || 0,
    grandstream_grp2613_qty: phoneCounts[1] || 0,
    grandstream_dp720_qty: phoneCounts[2] || 0,
    grp_2616_wall_mount_qty: phoneCounts[3] || 0,
    grp_2613_wall_mount_qty: phoneCounts[4] || 0,
    headset_adapter_qty: phoneCounts[5] || 0,
    granstrem_dp_720_type: this.prices_for_phone[2] || 0.0,
    granstrem_grp_2613_type: this.prices_for_phone[1] || 0.0,
    granstrem_grp_2616_type: this.prices_for_phone[0] || 0.0,
    granstrem_grp_2616_wall_type: this.prices_for_phone[3] || 0.0,
    granstrem_grp_2613_wall_type: this.prices_for_phone[4] || 0.0,
    headset_adapter: this.prices_for_phone[5] || 0.0,
    bbpos_wispos_qty: terminalCounts[0] || 0,
    bbpos_edock_qty: terminalCounts[1] || 0,
    bbpos_wisepos: this.prices_for_terminal[0] || 0.0,
    bbpos_edock: this.prices_for_terminal[1] || 0.0,
    verification_price: String(this.add_on_verification ?? ''),
  };
}

returnPackageName(packageName:string) {
 if(packageName === 'Adit Core') {
 let packageNames = 'Core';

const addOns: string[] = [];

if (this.addOnPhone) addOns.push('Phones');
if (this.addOnVerification) addOns.push('Verifications');
if (this.addOnAnalytic) addOns.push('Analytics');

if (addOns.length > 0) {
  packageNames += ' + ' + addOns.join(' + ');
}

return packageNames;

    }else if(packageName === 'tech') {
      return 'Tech Bundle';
    }else if(packageName === 'analytic') {
      return 'Analytics Bundle'; 
    }else if(packageName === 'aditLite' || packageName === 'Adit Lite') {
      return 'Adit Lite';
    }else if(packageName=='pozative'){
      return 'Pozative';
    }else if(packageName=='verification'){
      return 'Verification';
    }else{
      return packageName;
    }
}

getLocation(index: number): FormGroup {
  return this.locations.at(index) as FormGroup;
}

validatePostalCode(index: number): void {
  const group = this.getLocation(index);
  const country = group.get('practice_country')?.value;
  const zipControl = group.get('practice_postal_zip_code');
  const zip = zipControl?.value;

  let valid = true;

  if (country === 'UnitedStates') {
    valid = /^\d{5}(-\d{4})?$/.test(zip);
  } else if (country === 'Canada') {
    valid = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zip);
  }

  if (!valid) {
    zipControl?.setErrors({ invalidZip: true });
  } else {
    zipControl?.setErrors(null);
  }
}
validatePostalCodeInSipping() {
  const zipControl = this.shippingAddressForm.get('postalCode');
  const country = this.shippingAddressForm.get('country')?.value;
  const zip = zipControl?.value;

  let valid = true;

  if (country === 'UnitedStates') {
    const usZipRegex = /^\d{5}(-\d{4})?$/;
    valid = usZipRegex.test(zip);
  } else if (country === 'Canada') {
    const caZipRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    valid = caZipRegex.test(zip);
  }

  if (!valid) {
    zipControl?.setErrors({ invalidZip: true });
  } else {
    zipControl?.setErrors(null);
  }
}


}