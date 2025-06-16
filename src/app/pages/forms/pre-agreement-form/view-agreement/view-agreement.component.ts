import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import {
  verifications,
  communicationsList,
  mobile,
  operations,
  analytics,
} from '../tech-stack-comparison/tech-stack-gaps';
import { OnlineFormAgreementService } from '../../../../../services/online form/online-form-agreement.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PhoneNumberFormatterDirective } from '../../../../../directives/phone-number-formatter.directive';
import { ChoosePackagesComponent } from './choose-packages/choose-packages.component';
import Swal from 'sweetalert2';
import { HardwareService } from '../../../../services/hardware.service';
import { SubscriptionService } from '../../../../services/subscription.service';
import { PaymentCalculatorService } from '../../../../services/payment-calculator.service';
import { MatDialog } from '@angular/material/dialog';
import { CardDetailsComponent } from '../view-agreement-multiple/card-details/card-details.component';

@Component({
  selector: 'app-view-agreement',
  standalone: true,
  imports: [
    SweetAlert2Module,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ChoosePackagesComponent,
    PhoneNumberFormatterDirective,
  ],
  templateUrl: './view-agreement.component.html',
  styleUrl: './view-agreement.component.scss',
})
export class ViewAgreementComponent implements OnInit, AfterViewInit {
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
  private subscriptionService = inject(SubscriptionService);
  private paymentCalculator = inject(PaymentCalculatorService);
  private agreementService = inject(OnlineFormAgreementService);

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
    console.log(this.subscriptionPriceAnnually, 'this is calledd', source);
  }
  onAnnuallyorMonthlly(isAnnual: any) {
    this.isAnnually = isAnnual;
  }
  // Method to handle totalMonthly event
  onTotalMonthly(total: any) {
    this.subscriptionPriceMonthly = this.totalMonthly = total;
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

  checkConditionForHardware: boolean = false;

  // Method to add a new location form group
  addLocation(): void {
    const newIndex = this.locations.length;
    this.locations.push(this.createLocationGroup());

    // Initialize hardware counts for the new location
    if (!this.hardware_counts) {
      this.hardware_counts = [];
    }

    this.hardware_counts[newIndex] = [];
    for (let j = 0; j < this.hardwarePrices.length; j++) {
      this.hardware_counts[newIndex][j] = {
        count: j === 0 ? 2 : 0,
        price: j === 0 ? 2 * this.getHardwarePrice(j) : 0,
      };
    }

    // Initialize other arrays as needed
    if (!this.hardwarepurchasePrices) {
      this.hardwarepurchasePrices = [];
    }
    this.hardwarepurchasePrices[newIndex] = 0;

    if (!this.extraharwarePrices) {
      this.extraharwarePrices = [];
    }
    this.extraharwarePrices[newIndex] = 0;

    // Initialize icon states after adding a location
    this.initializeIconStates();
  }

  // Method to remove a location form group
  removeLocation(index: number): void {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the location from the locations FormArray
        this.locations.removeAt(index);

        // Remove hardware data for this location
        this.hardware_counts.splice(index, 1);
        this.hardwarepurchasePrices.splice(index, 1);
        this.extraharwarePrices.splice(index, 1);

        // Remove add-on selections for this location
        this.phoneAddOnPricesByLocation.splice(index, 1);
        this.analyticsAddOnPricesByLocation.splice(index, 1);
        this.verificationAddOnPricesByLocation.splice(index, 1);

        // Remove hardware purchase flags
        this.purchasePhones.splice(index, 1);
        this.purchaseTerminals.splice(index, 1);

        // If using subscription plans per location, update those too
        if (this.subscriptionPlans && this.subscriptionPlans.length > index) {
          this.subscriptionPlans.splice(index, 1);
        }

        // After removing a location, reinitialize icon states
        this.initializeIconStates();

        // Recalculate totals
        // this.calculateTotalSubscriptionPrice();
        this.calculateTotalHardwarePriceTotal();

        Swal.fire('Deleted!', '', 'success');
      }
    });
  }

  updateAllActiveState(): void {
    this.allActivePhone = this.iconStates.every(
      (rowState) => rowState.phoneActive
    );
    this.ifAnyActivePhone = this.iconStates.some(
      (rowState) => rowState.phoneActive
    );

    this.allActiveAnalytic = this.iconStates.every(
      (rowState) => rowState.analyticActive
    );
    this.allActiveVerification = this.iconStates.every(
      (rowState) => rowState.verificationActive
    );
  }


  ngOnInit(): void {
    // Initialize hardware_counts as a 2D array
    this.hardware_counts = [];

    // Load data from API
    this.loadAgreementData();
    
  }

  // Separate method for loading agreement data (keeps ngOnInit cleaner)
  private loadAgreementData(): void {
    this.agreementId = this.activeRoute.snapshot.params['agreementId'];

    this.agreementService.getAgreement(this.agreementId).subscribe((res) => {
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

        // Make sure the form is initialized
        // if (!this.shippingAddressForm) {
        //   this.shippingAddressForm = this.fb.group({
        //     address_line_1: ['', Validators.required],
        //     address_line_2: [''],
        //     city: ['', Validators.required],
        //     state: ['', Validators.required],
        //     postalCode: ['', Validators.required],
        //     country: ['', Validators.required],
        //   });
        // }

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

      // console.log(this.pricingArray, 'EARRRRRRRRRRRRRR');
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
              data['PMS'] || '',
              Validators.required,
            ],
            practice_poc: [data['POC Name'] || '', Validators.required],
            practice_poc_email: [data['POC Email'] || '', Validators.required],
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
        
        // Only expand the form if at least one location has a practiceName with a value
        const hasValidPracticeName = responseData.practiceData.some(
          (data: any) => data.practiceName != null && data.practiceName !== ''
        );
        
        this.expandForm = hasValidPracticeName;
        this.checkConditionForHardware = hasValidPracticeName;
        this.expandReview = hasValidPracticeName;
        
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
          this.signaturePad = new SignaturePad(
            this.signatureCanvas?.nativeElement,
            {
              backgroundColor: 'white',
              penColor: 'black',
            }
          );
          this.resizeCanvas();
        }, 200);
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
        this.selectedPackageName = this.whichPackageToShow = responseData.practiceData[0].selectedPackageName;
        this.expandHardware = true;
        // console.log(this.whichPackageToShow, 'selectedPackageName');
        if (this.selectedPackageName == 'Adit Lite') {
          this.ifPackageAditLite = true;
          this.showSelection_of_phone = false;
        }
      } else {
        if( responseData.sales_person_promotion_type=='') {
        this.showOnlyTechStack=true
        }
        this.whichPackageToShow = responseData.sales_person_promotion_type;
      }
      if (responseData.displayTechStackComparison == false) {
        this.showtechStackGap = false;
      } else {
        this.showtechStackGap = true;
        const featuresArray = responseData.techStack[0].features;
        console.log(featuresArray, 'featuresArray',communicationsList);
        this.updateArrayWithFeatures(this.communicationsList, featuresArray);

        this.updateArrayWithFeatures(this.analytics, featuresArray);

        this.updateArrayWithFeatures(this.mobile, featuresArray);
        this.updateArrayWithFeatures(this.operations, featuresArray);
      }
      if (responseData.techStack.length > 0) {
        this.totalCost = responseData.techStack[0].tech_stack_total_prices;
      }
      this.activation_fee = responseData.activation_fee;

      // addon data patching
      if (
        responseData.priceAddons &&
        typeof responseData.priceAddons === 'object'
      ) {
        // Reset add-on arrays to hold the correct state for each location
        this.phoneAddOnPricesByLocation = [];
        this.analyticsAddOnPricesByLocation = [];
        this.verificationAddOnPricesByLocation = [];

        // Get all location names from the priceAddons object
        const locationNames = Object.keys(responseData.priceAddons);

        // For each location in the form
        this.locations.controls.forEach((locationControl, index) => {
          const locationName = locationControl.get('location_name')?.value;

          // Find the matching priceAddons entry for this location
          if (locationName && locationNames.includes(locationName)) {
            const locationAddons = responseData.priceAddons[locationName];

            // Set add-on flags based on the API response
            this.phoneAddOnPricesByLocation[index] =
              locationAddons.phone_show === 'Yes';
            this.analyticsAddOnPricesByLocation[index] =
              locationAddons.analytics_show === 'Yes';
            this.verificationAddOnPricesByLocation[index] =
              locationAddons.verification_show === 'Yes';

            // Update add-on prices
            this.add_on_phones =
              locationAddons.phone_orginal_price || this.add_on_phones;
            this.add_on_analytic =
              locationAddons.analytics_orginal_price || this.add_on_analytic;
            this.add_on_verification =
              locationAddons.verification_orginal_price ||
              this.add_on_verification;

            // Set AditCore flag if applicable
            if (locationAddons.allow_adit_core_only === 1) {
              this.ifPackageisAditCore = true;
            }
          } else {
            // Default values for locations without priceAddons data
            this.phoneAddOnPricesByLocation[index] = false;
            this.analyticsAddOnPricesByLocation[index] = false;
            this.verificationAddOnPricesByLocation[index] = false;
          }
        });

        // For single location mode, set the NVP addon properties
        if (this.multiple_location !== 'yes' && locationNames.length > 0) {
          const firstLocation = responseData.priceAddons[locationNames[0]];
          this.selectedAddonPhone_nvp = firstLocation.phone_show === 'Yes';
          this.selectedAddonAnalytic_nvp =
            firstLocation.analytics_show === 'Yes';
          this.selectedAddonVerification_nvp =
            firstLocation.verification_show === 'Yes';
        }
      }

      if (responseData.signature_url) {
        this.signature_url = responseData.signature_url;
      }
      if (responseData.signatory_name) {
        this.signature_name = responseData.signatory_name;
      }
      if (responseData.isAnnually == 'Monthly') {
        this.isAnnually = false;
      } else if (responseData.isAnnually == 'Annually') {
        this.isAnnually = true;
      }

      if (responseData.organization_name) {
        this.organization_name = responseData.organization_name;
      }

      if (responseData.organization_poc_name) {
        this.organization_poc_name = responseData.organization_poc_name;
      }

      if (responseData.organization_poc_email) {
        this.organization_poc_email = responseData.organization_poc_email;
      }

      if (responseData.organization_poc_work_number) {
        this.organization_poc_work_number =
          responseData.organization_poc_work_number;
      }

      if (responseData.organization_poc_cell_number) {
        this.organization_poc_cell_number =
          responseData.organization_poc_cell_number;
      }

      // After you receive the API response and have access to hardwareOrders:
      if (
        responseData.hardwareOrders &&
        Array.isArray(responseData.hardwareOrders)
      ) {
        // Reset counts
        this.counts_for_phone = [2, 0, 0, 0, 0, 0];
        this.counts_for_terminal = [0, 0];

        responseData.hardwareOrders.forEach((order: any) => {
          // Check if it's a phone
          const phoneIndex = this.name_of_phone.indexOf(order.hardwareName);
          if (phoneIndex !== -1) {
            this.counts_for_phone[phoneIndex] = order.count;
          }
          // Check if it's a terminal
          const terminalNames = ['BBPOS WisePOS E', 'BBPOS WisePOS E Dock'];
          const terminalIndex = terminalNames.indexOf(order.hardwareName);
          if (terminalIndex !== -1) {
            this.counts_for_terminal[terminalIndex] = order.count;
          }
        });

        // Update total prices after patching
        this.calculateTotalPrice();
      }

      // Initialize hardware counts after loading locations
      this.initializeHardwareCounts();

      // After locations are loaded and initialized, initialize icon states
      this.initializeIconStates();
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

  onPackageSelectedChange(selected: string) {
    this.selectedPackageName = selected;
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
    return this.fb.group({
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
      practice_email: ['', Validators.required],
      practice_website_url: [''],
      practice_management_software: ['', Validators.required],
      practice_poc: ['', Validators.required],
      practice_poc_email: ['', Validators.required],
      practice_poc_work_number: ['', Validators.required],
      practice_poc_cell_number: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.practiceData.value, 'Form Data');
    let formData: {
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
       priceAddons: {}
    };


  
      // For single location, create a simpler hardware inventory object
      if (this.selectPhone || this.selectTerminal) {
        const locationName = this.locations.at(0)?.get('location_name')?.value || 'Location 1';
        formData.hardware_inventory = {
          [locationName]: {
            ...(this.selectPhone ? this.getHardwareCountsObject() : {}),
            ...(this.selectTerminal ? this.getTerminalCountsObject() : {})
          }
        };
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
  } else {
    // For multiple locations, add an entry for each location
    this.locations.controls.forEach((locationControl, index) => {
      const locationName = locationControl.get('location_name')?.value || `Location ${index + 1}`;
      
      formData.priceAddons![locationName] = {
        phone_show: this.phoneAddOnPricesByLocation[index] ? 'Yes' : 'No',
        phone_orginal_price: this.add_on_phones || '',
        phone_discnt_price: this.add_on_phones || '',
        analytics_show: this.analyticsAddOnPricesByLocation[index] ? 'Yes' : 'No',
        analytics_orginal_price: this.add_on_analytic || '',
        analytics_discnt_price: this.add_on_analytic || '',
        verification_show: this.verificationAddOnPricesByLocation[index] ? 'Yes' : 'No',
        verification_orginal_price: this.add_on_verification || '',
        verification_discnt_price: this.add_on_verification || '',
        allow_adit_core_only: this.ifPackageisAditCore ? 1 : 0
      };
    });
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
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getHardwareCountsObject(): { [key: string]: number } {
    // If selectPhone is false, return empty object
    if (!this.selectPhone) {
      return {};
    }

    // If selectPhone is true, return the hardware counts
    return this.name_of_phone.reduce((acc, phoneName, index) => {
      if (this.counts_for_phone[index] > 0) {
        acc[phoneName] = this.counts_for_phone[index];
      }
      return acc;
    }, {} as { [key: string]: number });
  }

  getTerminalCountsObject(): { [key: string]: number } {
    // If selectTerminal is false, return empty object
    if (!this.selectTerminal) {
      return {};
    }

    // If selectTerminal is true, return the terminal counts
    const terminalNames = ['BBPOS WisePOS E', 'BBPOS WisePOS E Dock']; // Replace with your actual terminal names if different
    return terminalNames.reduce((acc, terminalName, index) => {
      if (this.counts_for_terminal[index] > 0) {
        acc[terminalName] = this.counts_for_terminal[index];
      }
      return acc;
    }, {} as { [key: string]: number });
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
    setTimeout(() => {
      this.showTable = true;
      this.activatePricingForharware();
    }, 1000);
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
      if (index === 0 && this.counts_for_phone[index] <= 2) {
        return; // Prevent decrementing below 2 for index 0
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

  // Method to handle multiple location events
  //tech






  // hande subscription plan when select multiple location

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
  counts: number[] = [2, 0, 0, 0, 0, 0]; // Default count for GRP 2616 is set to 2

  // Update the total hardware purchase price for a specific row
  updateHardwarePurchasePrice(rowIndex: number): void {
    const hardwareCredit = this.isAnnually
      ? this.hardwareCreditAnnually
      : this.hardwareCreditMonthly;

    this.hardwareService.updateHardwarePurchasePrice(
      this.hardware_counts,
      rowIndex,
      hardwareCredit,
      this.hardwarepurchasePrices,
      this.extraharwarePrices
    );
  }
  // Increment the hardware count for a specific row and column
  increment_forMultiple(rowIndex: number, hardwareIndex: number): void {
    const hardware = this.hardware_counts[rowIndex][hardwareIndex];
    hardware.count++;
    hardware.price = hardware.count * this.getHardwarePrice(hardwareIndex);
    this.updateHardwarePurchasePrice(rowIndex);
  }

  // Decrement the hardware count for a specific row and column
  decrement_forMultiple(rowIndex: number, hardwareIndex: number): void {
    const hardware = this.hardware_counts[rowIndex][hardwareIndex];
    if (hardware.count > 0) {
      hardware.count--;
      hardware.price = hardware.count * this.getHardwarePrice(hardwareIndex);
      this.updateHardwarePurchasePrice(rowIndex);
    }
  }

  // Get the price of a specific hardware item
  getHardwarePrice(hardwareIndex: number): number {
    // const prices = [150, 100, 100, 10, 10, 275, 250, 49]; // Prices for each hardware item
    // return this.hardwarePrices[hardwareIndex] || 0;
    return this.hardwareService.getHardwarePrice(hardwareIndex);
  }
  calculateTotalHardwarePrice() {
    // return this.extraharwarePrices.reduce((total, price) => total + price, 0);
    return this.hardwareService.calculateTotalHardwarePrice(this.extraharwarePrices)
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

      // Get hardware credit for comparison
      // const hardwareCredit = this.isAnnually
      //   ? Number(this.hardwareCreditAnnually) || 0
      //   : Number(this.hardwareCreditMonthly) || 0;

      // Add the total for this location
      totalHardwarePrice += Number(purchasePrice) + Number(extraPrice);
    }

    // Determine total hardware credit across all locations
    // const totalLocations = this.hardwarepurchasePrices.length;
    // const totalHardwareCredit =
    //   (this.isAnnually
    //     ? Number(this.hardwareCreditAnnually)
    //     : Number(this.hardwareCreditMonthly)) * totalLocations || 0;
    return totalHardwarePrice;
  }
  getSubscriptionsTotal() {
if (this.multiple_location == 'no') {
      return this.subscriptionPriceAnnually;
    } else {
      return 0;
    }
  }
  getSubscriptionsTotalMonthly() {
   if (this.multiple_location === 'no') {
      return this.subscriptionPriceMonthly;
    } else {
      return 0;
    }
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
    return total;
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
    // console.log(event, 'event of phone');
  }

  onSelectedAnalytics(event: any) {
    this.analyticActive = event;
    this.addOnAnalytic = event;
  }

  onSelectedVerification(event: any) {
    this.verificationActive = event;
    this.addOnVerification = event;
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
 
    else    if (this.whichPackageToShow === 'Only Lite - 1st Yr Promo') {
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
            this.signatureCanvas?.nativeElement,
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

  // Add this method to properly initialize iconStates
  initializeIconStates() {
    // Create an icon state for each location
    this.iconStates = Array(this.locations.length)
      .fill(null)
      .map(() => ({
        phoneActive: true,
        analyticActive: true,
        verificationActive: true,
        phoneSelectionActive: true,
        purchasePhone: true,
      }));

    // Initialize related arrays
    this.purchasePhones = this.iconStates.map((state) => state.purchasePhone);
    this.purchaseTerminals = Array(this.locations.length).fill(false);

    this.phoneAddOnPricesByLocation = Array(this.locations.length).fill(
      this.add_on_phones || 0
    );
    this.analyticsAddOnPricesByLocation = Array(this.locations.length).fill(
      this.add_on_analytic || 0
    );
    this.verificationAddOnPricesByLocation = Array(this.locations.length).fill(
      this.add_on_verification || 0
    );

    // Update all states
    this.updateAllActiveState();
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
  toggleIconState(
    rowIndex: number,
    iconType:
      | 'phoneActive'
      | 'analyticActive'
      | 'verificationActive'
      | 'purchasePhone'
  ): void {
    const rowState = this.iconStates[rowIndex];
    const previousState = rowState[iconType]; // Store previous state before toggling

    // Toggle the icon state
    rowState[iconType] = !rowState[iconType];

    // Update prices based on the toggle
    if (iconType === 'phoneActive') {
      // Handle phone add-on price
      if (rowState.phoneActive && !previousState) {
        // Add price when turning on - with Number conversion
        this.phoneAddOnPricesByLocation[rowIndex] = true;
        debugger;
      } else if (!rowState.phoneActive && previousState) {
        // Remove price when turning off
        this.phoneAddOnPricesByLocation[rowIndex] = false;
        debugger;
      }

      // Also update purchase phone state
      rowState.purchasePhone = rowState.phoneActive;
      this.purchasePhones[rowIndex] = rowState.phoneActive;
    } else if (iconType === 'analyticActive') {
      // Handle analytics add-on price with Number conversion
      if (rowState.analyticActive && !previousState) {
        this.analyticsAddOnPricesByLocation[rowIndex] = true;
      } else if (!rowState.analyticActive && previousState) {
        this.analyticsAddOnPricesByLocation[rowIndex] = false;
      }
    } else if (iconType === 'verificationActive') {
      // Handle verification add-on price with Number conversion
      if (rowState.verificationActive && !previousState) {
        this.verificationAddOnPricesByLocation[rowIndex] = true;
      } else if (!rowState.verificationActive && previousState) {
        this.verificationAddOnPricesByLocation[rowIndex] = false;
      }
    }

    // Update the overall states
    this.updateAllActiveState();

    // Recalculate total subscription price
    // this.calculateTotalSubscriptionPrice();
  }
  // calculateTotalSubscriptionPrice() {
    // const basePackagePrice = this.getBasePackagePrice();

    // Add up all add-on prices across locations with explicit Number() conversion
    // const totalPhoneAddOns = this.phoneAddOnPricesByLocation.reduce(
    //   (sum, price) => Number(sum) + Number(price || 0),
    //   0
    // );

    // const totalAnalyticsAddOns = this.analyticsAddOnPricesByLocation.reduce(
    //   (sum, price) => Number(sum) + Number(price || 0),
    //   0
    // );

    // const totalVerificationAddOns =
    //   this.verificationAddOnPricesByLocation.reduce(
    //     (sum, price) => Number(sum) + Number(price || 0),
    //     0
    //   );
    // console.log(
    //   {
    //     basePackagePrice: Number(basePackagePrice),
    //     totalPhoneAddOns: Number(totalPhoneAddOns),
    //     totalAnalyticsAddOns: Number(totalAnalyticsAddOns),
    //     totalVerificationAddOns: Number(totalVerificationAddOns),
    //     result: this.isAnnually
    //       ? this.subscriptionPriceAnnually
    //       : this.subscriptionPriceMonthly,
    //   },
    //   'Calculation values after number conversion'
    // );
  // }

  // Add this helper method to get the base package price without add-ons
  getBasePackagePrice(): number {
    // Get the base price depending on the selected package
    if (this.ifPackageisAditCore) {
      return (
        Number(
          this.isAnnually ? this.aditCore_annually : this.aditCore_monthly
        ) || 0
      );
    } else if (this.ifPackageAditLite) {
      return (
        Number(this.isAnnually ? this.aditLiteAnnual : this.aditLiteMontly) || 0
      );
    } else if (this.selectedPackageName === 'Tech Bundle') {
      return Number(this.isAnnually ? this.techAnnual : this.techMonthly) || 0;
    } else if (this.selectedPackageName === 'Analytic Bundle') {
      return (
        Number(this.isAnnually ? this.analyticAnnual : this.analyticMonthly) ||
        0
      );
    } else if (this.pozativeSelectedChange) {
      return (
        Number(
          this.isAnnually
            ? this.pozative_Only_Annually
            : this.pozative_Only_Monthly
        ) || 0
      );
    } else if (this.verificationsNVPSelectedChange) {
      return (
        Number(
          this.isAnnually
            ? this.verifications_Only_Annually
            : this.verifications_Only_Annually
        ) || 0
      );
    }

    // Default fallback
    return 0;
  }

  calculateLocationTotal(locationIndex: number): number {
    // Base subscription from the package
    let baseSubscription = 0;
    baseSubscription = this.getBasePackagePrice();

    // Add-on prices for this location - use fixed prices when the boolean is true
    const phoneAddOn = this.phoneAddOnPricesByLocation[locationIndex]
      ? Number(this.add_on_phones || 0)
      : 0;

    const analyticsAddOn = this.analyticsAddOnPricesByLocation[locationIndex]
      ? Number(this.add_on_analytic || 0)
      : 0;

    const verificationAddOn = this.verificationAddOnPricesByLocation[
      locationIndex
    ]
      ? Number(this.add_on_verification || 0)
      : 0;

    // Calculate the annual total for this location
    const total = this.subscriptionService.calculateLocationTotal(
      baseSubscription,
      this.isAnnually,
      phoneAddOn,
      analyticsAddOn,
      verificationAddOn
    );

    this.calculateLocationTotalForMonthly(locationIndex);
    return total;
  }
  convertStringToNumber(value: string | null): number {
    if (value === null) {
      return 0; // Return 0 if the value is null
    }
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue; // Return 0 if conversion fails
  }
  calculateLocationTotalForMonthly(locationIndex: number): number {
    // Base subscription from the package
    let baseSubscription = 0;
    baseSubscription = this.subscriptionPriceMonthly;
    // Add-on prices for this location - use fixed prices when the boolean is true
    const phoneAddOn = this.phoneAddOnPricesByLocation[locationIndex]
      ? Number(this.add_on_phones || 0)
      : 0;

    const analyticsAddOn = this.analyticsAddOnPricesByLocation[locationIndex]
      ? Number(this.add_on_analytic || 0)
      : 0;

    const verificationAddOn = this.verificationAddOnPricesByLocation[
      locationIndex
    ]
      ? Number(this.add_on_verification || 0)
      : 0;

    // Calculate the annual total for this location
    const total =
      baseSubscription + phoneAddOn + analyticsAddOn + verificationAddOn;

    return total;
  }


  getHarwareCreditTotal() {
    const hardwareInventory = this.getLocationHardwareInventory();

    const locationsWithHardware = Object.keys(hardwareInventory).length;

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
  getHardwarePriceInTable(index: number): number {
    return this.hardwarepurchasePrices[index];
  }
  getHardwareCreditDisplay(index: number): number {
    if (this.isAnnually) {
      return (
        this.hardwareService.getMinValue(
          this.hardwarepurchasePrices[index],
          this.hardwareCreditAnnually
        ) || 0
      );
    } else {
      return (
        this.hardwareService.getMinValue(
          this.hardwarepurchasePrices[index],
          this.hardwareCreditMonthly
        ) || 0
      );
    }
  }
 
  showSameAddressPractice() {
    this.sameAsPracticeAddress = !this.sameAsPracticeAddress;
        this.cdr.detectChanges();
  }


  //accept condtions after signature
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
togglePayment(): void {
  this.hideAllcards=true
  this.expandPayment = true; 
  this.expandHardware=false;
  this.expandForm=false;
  this.expandReview=false;

}
readonly dialog = inject(MatDialog);

openDialog(){
  let dialog =  this.dialog.open(CardDetailsComponent, {
    maxWidth:'80vw',
    minWidth:'400px',
  });

  dialog.afterClosed().subscribe(result => {
    console.log(result)
  });
}


}