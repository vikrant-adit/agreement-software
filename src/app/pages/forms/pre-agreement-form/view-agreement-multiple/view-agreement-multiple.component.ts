import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
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
import { ChoosePackagesComponent } from '../view-agreement/choose-packages/choose-packages.component';
import Swal from 'sweetalert2';
import { HardwareService } from '../../../../services/hardware.service';
import { SubscriptionService } from '../../../../services/subscription.service';
import { PaymentCalculatorService } from '../../../../services/payment-calculator.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CardDetailsComponent } from './card-details/card-details.component';
@Component({
  selector: 'app-view-agreement-multiple',
  standalone: true,
  imports: [
    SweetAlert2Module,
    MatDialogModule,
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
  templateUrl: './view-agreement-multiple.component.html',
  styleUrl: './view-agreement-multiple.component.scss',
})
export class ViewAgreementMultipleComponent implements OnInit, AfterViewInit {
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

  organization_name: any;
  organization_poc_name: any;
  organization_poc_email: any;
  organization_poc_work_number: any;
  organization_poc_cell_number: any;
  signature_name: any;
  signature_url: any;
  totalAnnually: any;
  totalMonthly: any;
  packageToBeShown: boolean = false;

  separateCard: boolean = true;
  no_of_days=45
  // nextToHardware:boolean=false
  // signatureUrlFromApi: string | null = null; // Add this property to your class

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.practiceData = this.fb.group({
      locations: this.fb.array([this.createLocationGroup()]),
    });

    // Initialize shipping form properly
    this.shippingAddressForm = this.fb.group({
      shippingAddress: this.fb.array([this.createShippingAddressGroup()]),
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
    { value: 'analytic', label: 'Analytic Bundle' }, // Example of additional dynamic options
  ];
  expandedLocationIndices: number[] = [0]; // By default, only first location is expanded

  toggleLocationExpansion(index: number): void {
    if (this.expandedLocationIndices.includes(index)) {
      // If already expanded, remove it (collapse)
      this.expandedLocationIndices = this.expandedLocationIndices.filter(
        (i) => i !== index
      );
    } else {
      // If collapsed, add it (expand)
      this.expandedLocationIndices.push(index);
    }
  }
  onNextClick() {
    this.onSubmit();
  }

  onTotalAnnually(total: any, source: any) {
    this.subscriptionPriceAnnually = this.totalAnnually = total;
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
  //shipping address

  sameAsPracticeAddress: boolean = false;
  countries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
  ];
showOnlyTechStack: boolean = false;
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
        price: this.hardwarePrices[j],
      };
    }

    // Initialize other arrays as needed
    if (!this.hardwarepurchasePrices) {
      this.hardwarepurchasePrices = [];
    }
    this.hardwarepurchasePrices[newIndex] = 300;
// debugger

    // Initialize selectedPackage array for the new location
    if (!this.selectedPackage[newIndex]) {
      this.selectedPackage[newIndex] = '';
    }

    // Initialize subscription plans for the new location
    if (!this.subscriptionPlans[newIndex]) {
      this.subscriptionPlans[newIndex] = { annually: 0, monthly: 0 };
    }

    // Initialize icon states after adding a location
    this.initializeIconStates();
    this.initializeShippingForms()
  }

  // Method to remove a location form group
  removeLocation(index: number): void {
    Swal.fire({
      title: 'Do you want to delete this location?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        let locationId = null;
        let agreementId = null;

        // Remove the location from the locations FormArray
        this.locations.removeAt(index);
        if (
          this.savePracticeData &&
          this.savePracticeData.length > index &&
          this.savePracticeData[index]
        ) {
          locationId = this.savePracticeData[index].locationId || null;
          agreementId = this.savePracticeData[index].agreementId || null;

          this.agreementService
            .deletePracticeLocation(agreementId, locationId)
            .subscribe(
              (response) => {

                // Only remove the data from UI after successful API response
                // Remove hardware data for this location
                this.hardware_counts.splice(index, 1);
                this.hardwarepurchasePrices.splice(index, 1);
                // this.extraharwarePrices.splice(index, 1);

                // Remove add-on selections for this location
                this.phoneAddOnPricesByLocation.splice(index, 1);
                this.analyticsAddOnPricesByLocation.splice(index, 1);
                this.verificationAddOnPricesByLocation.splice(index, 1);

                // Remove hardware purchase flags
                this.purchasePhones.splice(index, 1);
                this.purchaseTerminals.splice(index, 1);

                // Remove selectedPackage entry for this location
                this.selectedPackage.splice(index, 1);

                // If using subscription plans per location, update those too
                if (
                  this.subscriptionPlans &&
                  this.subscriptionPlans.length > index
                ) {
                  this.subscriptionPlans.splice(index, 1);
                }

                // After removing a location, reinitialize icon states
                this.initializeIconStates();

                // Recalculate totals
                this.calculateTotalHardwarePriceTotal();

                Swal.fire('Deleted!', '', 'success');
              },
              (error) => {
                console.error('Error deleting location:', error);

                // Add the location back to the form array since deletion failed
                if (
                  this.savePracticeData &&
                  this.savePracticeData.length > index &&
                  this.savePracticeData[index]
                ) {
                  const locationData = this.savePracticeData[index];
                  const locationGroup = this.createLocationGroup();

                  // Patch the form with existing data
                  locationGroup.patchValue({
                    practice_name: locationData.practiceName || '',
                    location_name: locationData.locationName || '',
                    practiceAdressLine_1:
                      locationData.practiceAdressLine1 || '',
                    practiceAdressLine_2:
                      locationData.practiceAdressLine2 || '',
                    practice_city: locationData.practiceCity || '',
                    practice_state: locationData.practiceState || '',
                    practice_postal_zip_code:
                      locationData.practicePostalZipCode || '',
                    practice_country: locationData.practiceCountry || '',
                    practice_timezone: locationData.practiceTimezone || '',
                    practice_office_phone:
                      locationData.practiceOfficePhone || '',
                    practice_email: locationData.practiceEmail || '',
                    practice_website_url: locationData.practiceWebsiteUrl || '',
                    practice_management_software:
                      locationData.practice_management_software || '',
                    practice_poc: locationData.practicePoc || '',
                    practice_poc_email: locationData.practicePocEmail || '',
                    practice_poc_work_number:
                      locationData.practicePocWorkNumber || '',
                    practice_poc_cell_number:
                      locationData.practicePocCellNumber || '',
                  });

                  // Insert the location group back at the correct index
                  this.locations.insert(index, locationGroup);
                }

                Swal.fire(
                  'Error!',
                  'Failed to delete the location. Please try again.',
                  'error'
                );
              }
            );
        }
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

  createShippingAddressForm() {
    return this.fb.group({
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Initialize hardware_counts as a 2D array
    this.hardware_counts = [];
    // Load data from API
    this.loadAgreementData();
  }
  initializeShippingForms() {
    // Get the shippingAddress FormArray
    const shippingAddressArray = this.shippingAddressForm.get(
      'shippingAddress'
    ) as FormArray;

    // Clear existing forms
    while (shippingAddressArray.length !== 0) {
      shippingAddressArray.removeAt(0);
    }

    // Add a shipping form for each location
    const locationCount = this.locations?.controls?.length || 0;
    for (let i = 0; i < locationCount; i++) {
      shippingAddressArray.push(this.createShippingAddressGroup());
    }

  }
  createShippingAddressGroup(): FormGroup {
    return this.fb.group({
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }
  signatureExists: boolean = false;
  savePracticeData: any[] = [];
  // Separate method for loading agreement data (keeps ngOnInit cleaner)
  private loadAgreementData(): void {
    this.agreementId = this.activeRoute.snapshot.params['agreementId'];

    this.agreementService.getAgreement(this.agreementId).subscribe((res) => {
      // Group the included keys by logical categories
      // Standard Package Options (Tech & Analytics bundles)
      const standardPackageKeys = [
        'techMonthly',
        'techMonthly_Disc',
        'techAnnual',
        'techAnnual_Disc',
        'analyticMonthly',
        'analyticMonthly_Disc',
        'analyticAnnual',
        'analyticAnnual_Disc',
      ];

      // Lite Package Options
      const litePackageKeys = [
        'aditLiteMontly',
        'aditLiteMontly_Disc',
        'aditLiteAnnual',
        'aditLiteAnnual_Disc',
      ];

      // Core Pricing Options
      const corePackageKeys = [
        'aditCore_monthly',
        'aditCore_annually',
      ];

      // Add-on Options
      const addOnKeys = [
        'add_on_phones',
        'add_on_analytic',
        'add_on_verification',
      ];

      // No Vendor Promo Components
      const noVendorPromoKeys = [
        'pozative_Only_Monthly',
        'pozative_Only_Annually',
        'verifications_Only_Monthly',
        'verifications_Only_Annually',
      ];

      // Hardware Credits
      const hardwareCreditKeys = [
        'hardwareCreditAnnually',
        'hardwareCreditMonthly',
      ];

      // Combined array of all included keys
      const includedKeys = [
        ...standardPackageKeys,
        ...litePackageKeys,
        ...corePackageKeys,
        ...addOnKeys,
        ...noVendorPromoKeys,
        ...hardwareCreditKeys
      ];

      let responseData = res.data; // Assuming this is the key in the response
      
      // Create an object containing only the specified key-value pairs
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
      console.log("this is calledddddddd",this.dynamicPackages);
      if(responseData.no_of_days>0 && responseData.no_of_days!=null){
        this.no_of_days = responseData.no_of_days;
      }
      //packages
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
      this.iconStates = this.locations.controls.map(() => ({
        phoneActive: true,
        analyticActive: true,
        verificationActive: true,
        phoneSelectionActive: true,
        purchasePhone: true,
      }));

      this.multiple_location = responseData.multipleLocations;
      if (responseData.add_on_phones !== null) {
        this.addOnPhone = true;
      } else {
        this.addOnPhone = false;
      }

      if (responseData.add_on_analytic != null) {
        this.addOnAnalytic = true;
      }else {
        this.addOnAnalytic = false;
      }
      if (responseData.add_on_verification != null) {
        this.addOnVerification = true;
      }else{
        this.addOnVerification = false;
      }
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
        },100);
 
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
        responseData.practiceData.forEach((pack:any, index: number)=>{
          // Ensure selectedPackage array has enough elements
          if (!this.selectedPackage[index]) {
            this.selectedPackage[index] = '';
          }
          
          // Patch the selectedPackageName to the selectedPackage array
          if (pack.selectedPackageName) {
            this.selectedPackage[index] = pack.selectedPackageName;
            
            // Initialize subscription plans based on the selected package
            if (pack.selectedPackageName === 'tech') {
              this.subscriptionPlans[index] = {
                annually: Number(this.techAnnual_Disc) || 0,
                monthly: Number(this.techMonthly_Disc) || 0,
              };
            } else if (pack.selectedPackageName === 'analytic') {
              this.subscriptionPlans[index] = {
                annually: Number(this.analyticAnnual_Disc) || 0,
                monthly: Number(this.analyticMonthly_Disc) || 0,
              };
            } else if (pack.selectedPackageName === 'aditLite') {
              this.subscriptionPlans[index] = {
                annually: Number(this.aditLiteAnnual_Disc) || 0,
                monthly: Number(this.aditLiteMontly_Disc) || 0,
              };
            } else {
              this.subscriptionPlans[index] = { annually: 0, monthly: 0 };
            }
          }
        })

        this.checkConditionForHardware = hasValidPracticeName;
     
        this.savePracticeData = responseData.practiceData;
        responseData.practiceData.forEach((data: any) => {
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
      if (responseData.shippingAddress) {

        // Make sure the form is initialized
        if (!this.shippingAddressForm) {
          this.shippingAddressForm = this.fb.group({
            address_line_1: ['', Validators.required],
            address_line_2: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', Validators.required],
            country: ['', Validators.required],
          });
        }

        // Create a patching object with a match between API and form control names
        const patchData = {
          address_line_1: responseData.shippingAddress.addressLine1 || '',
          address_line_2: responseData.shippingAddress.addressLine2 || '',
          city: responseData.shippingAddress.city || '',
          state: responseData.shippingAddress.state || '',
          postalCode: responseData.shippingAddress.postalCode || '',
          country: responseData.shippingAddress.country || '',
        };

        this.shippingAddressForm.patchValue(patchData);

        // Force change detection
        setTimeout(() => {
          this.shippingAddressForm.updateValueAndValidity();
        },100);
      }
      if (responseData.selectPhone != null) {
        this.selectPhone = responseData.selectPhone; 
      }
      if (responseData.selectTerminal != null) {
        this.selectTerminal = responseData.selectTerminal; 
      }

      if (
        res.data.practiceData &&
        Array.isArray(res.data.practiceData) &&
        res.data.practiceData.length > 0 &&
        res.data.practiceData[0].selectedPackageName
      ) {
        this.selectedPackageName = this.whichPackageToShow =responseData.sales_person_promotion_type        
        if (this.selectedPackageName == 'Adit Lite') {
          this.ifPackageAditLite = true;
          this.showSelection_of_phone = false;
        }
      } else {
        if(responseData.sales_person_promotion_type==''){
          this.showOnlyTechStack=true
        }
        this.whichPackageToShow = responseData.sales_person_promotion_type;
      }
      if (responseData.displayTechStackComparison == false) {
        this.showtechStackGap = false;
      } else {
        this.showtechStackGap = true;
        const featuresArray = responseData.techStack[0].features;
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
      }
      this.initializeShippingForms();
      // this.updateArrayWithFeatures(this.verifications, featuresArray);
      if (responseData.signature_url) {
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
              if (
                this.dynamicPackages.length === 1 &&
                this.dynamicPackages[0].value === 'aditLite'
              ) {
                // For all subscriptionPlans, if annually is falsy, set it to aditLiteAnnual_Disc
              this.subscriptionPriceAnnually=responseData.aditLiteAnnual_Disc
              this.subscriptionPriceMonthly=Number(responseData.aditLiteMontly_Disc)
              }
            }, 100);
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



// Loop through each practiceData item and process its locationOrders
if (
  Array.isArray(responseData.practiceData)
) {
  // Map locationName to index in your locations FormArray
  const locationNameToIndex: { [name: string]: number } = {};
  this.locations.controls.forEach((locationControl, idx) => {
    const name = locationControl.get('location_name')?.value;
    if (name) locationNameToIndex[name] = idx;
  });

  // For each practiceData item
  console.log("Calling hardware patching for practiceData:", responseData.practiceData);
 this.activatePricingForharware(); 
responseData.practiceData.forEach((practiceItem: any) => {
  const order = practiceItem.locationOrders?.[0];
  if (!order) return;

  const idx = locationNameToIndex[order.locationName];
  if (idx === undefined) return;

 // If this is needed per location

  if (this.hardware_counts[idx]) {
    console.log("hardware with idx",this.hardware_counts[idx])
    // Assign counts
    this.hardware_counts[idx][0].count = Number(order.grandstream_grp2616_qty) || 0;
    this.hardware_counts[idx][1].count = Number(order.grandstream_grp2613_qty) || 0;
    this.hardware_counts[idx][2].count = Number(order.grandstream_dp720_qty) || 0;
    this.hardware_counts[idx][3].count = Number(order.grp_2616_wall_mount_qty) || 0;
    this.hardware_counts[idx][4].count = Number(order.grp_2613_wall_mount_qty) || 0;
    this.hardware_counts[idx][5].count = Number(order.headset_adapter_qty) || 0;
    this.hardware_counts[idx][6].count = Number(order.bbpos_wispos_qty) || 0;
    this.hardware_counts[idx][7].count = Number(order.bbpos_edock_qty) || 0;

    // Assign prices
    this.hardware_counts[idx][0].price = Number(order.granstrem_grp_2616_type) || 0;
    this.hardware_counts[idx][1].price = Number(order.granstrem_grp_2613_type) || 0;
    this.hardware_counts[idx][2].price = Number(order.granstrem_dp_720_type) || 0;
    this.hardware_counts[idx][3].price = Number(order.granstrem_grp_2616_wall_type) || 0;
    this.hardware_counts[idx][4].price = Number(order.granstrem_grp_2613_wall_type) || 0;
    this.hardware_counts[idx][5].price = Number(order.headset_adapter) || 0;
    this.hardware_counts[idx][6].price = Number(order.bbpos_wisepos) || 0;
    this.hardware_counts[idx][7].price = Number(order.bbpos_edock) || 0;

    // Update total hardware price
    const rowTotal = this.hardware_counts[idx].reduce((sum, item) => sum + (item.count * item.price), 0);
    this.totalHardwarePrice += rowTotal;

    // Booleans
    const PhonehardwareQtys = [
      Number(order.grandstream_grp2616_qty) || 0,
      Number(order.grandstream_grp2613_qty) || 0,
      Number(order.grandstream_dp720_qty) || 0,
      Number(order.grp_2616_wall_mount_qty) || 0,
      Number(order.grp_2613_wall_mount_qty) || 0,
      Number(order.headset_adapter_qty) || 0,
    ];

    const TerminalhardwareQtys = [
      Number(order.bbpos_wispos_qty) || 0,
      Number(order.bbpos_edock_qty) || 0,
    ];

    this.purchasePhones[idx] = PhonehardwareQtys.some(q => q > 0);
    this.purchaseTerminals[idx] = TerminalhardwareQtys.some(q => q > 0);
    // debugger
  }

  this.hardware_counts = [...this.hardware_counts]; // Trigger change detection
  console.log("HArdware cOuntt",this.hardware_counts);
  this.showTable = true;
});

this.totalHardwarePrice = this.totalHardwarePrice - this.getHardwareCreditDisplayInTable();


  if(this.hardware_counts.length== 0){
    const defaultHardwareData = [
  { count: 2, price: 150 },
  { count: 0, price: 100 },
  { count: 0, price: 100 },
  { count: 0, price: 10 },
  { count: 0, price: 10 },
  { count: 0, price: 275 },
  { count: 0, price: 250 },
  { count: 0, price: 49 },
];
 this.showTable = true;
this.locations.controls.forEach((_, idx) => {
  this.hardware_counts[idx] = [...defaultHardwareData];
  this.initializeShippingForms();
});
}

   this.hardwarepurchasePrices = this.hardware_counts.map((row) =>
            row.reduce((total, hardware) => total + (hardware.count * hardware.price), 0)
          );
            this.updateHardwarePurchasePrice()
        this.calculateTotalHardwarePriceTotal();
      // Update loadAgreementData method to handle the shipping addresses array
      if (
        responseData.shippingAddresses &&
        Array.isArray(responseData.shippingAddresses) &&
        responseData.shippingAddresses.length > 0
      ) {
        // Initialize the form with a FormArray if it doesn't exist
        if (!this.shippingAddressForm) {
          this.shippingAddressForm = this.fb.group({
            shippingAddress: this.fb.array([]),
          });
        }

        // Make sure the shippingAddress FormArray has at least one form group
        const shippingArray = this.shippingAddressForm.get(
          'shippingAddress'
        ) as FormArray;

        // Clear any existing forms in the array
        while (shippingArray.length > 0) {
          shippingArray.removeAt(0);
        }

        // Process each shipping address from the API
        responseData.shippingAddresses.forEach(
          (address: any, index: number) => {
            // Add a new shipping form group for each address
            shippingArray.push(this.createShippingAddressGroup());

            // Create patching data
            const patchData = {
              address_line_1: address.addressLine1 || '',
              address_line_2: address.addressLine2 || '',
              city: address.city || '',
              state: address.state || '',
              postalCode: address.postalCode || '',
              country: address.country || '',
            };
            // Patch the values to the corresponding form group in the array
            shippingArray.at(index).patchValue(patchData);
          }
        );

        // Set flags to show the shipping address form

        if (!this.sameAddressForMultipleLocation) {
          this.sameAddressForMultipleLocation = [];
        }

        responseData.shippingAddresses.forEach((index: number) => {
          if (index < this.locations.length) {
            this.sameAddressForMultipleLocation[index] = false;
          }
        });

      }
      // After locations are loaded and initialized, initialize icon states
      this.initializeIconStates();
      
      // Ensure selectedPackage array is properly sized
      this.ensureSelectedPackageArraySize();
    }
    setTimeout(() => {
          this.cdr.detectChanges();

    })
    });
  }

  // Method to ensure selectedPackage array has the correct size
  private ensureSelectedPackageArraySize(): void {
    const locationCount = this.locations.length;
    
    // Ensure selectedPackage array has enough elements
    while (this.selectedPackage.length < locationCount) {
      this.selectedPackage.push('');
    }
    
    // Ensure subscriptionPlans array has enough elements
    while (this.subscriptionPlans.length < locationCount) {
      this.subscriptionPlans.push({ annually: 0, monthly: 0 });
    }
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

  // Add a getter for shippingAddress array
  get shippingAddress(): FormArray {
    return this.shippingAddressForm.get('shippingAddress') as FormArray;
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

 nextButtonMultipleLocation() {
  // Check if forms are valid before proceeding
  if (this.validateForms()) {
    // Logic to go to next step if validation passes
    this.onNextClick();
  }
}

validateForms() {
  let isValid = true;
  const errorMessages: string[] = [];

  // 1. Validate organization info (if required)
  if (!this.organization_name && this.multiple_location === 'yes') {
    isValid = false;
    errorMessages.push('Organization Name is required');
  }

  // 2. Validate locations form array
  const locationControls = this.locations.controls;
  
  if (locationControls.length === 0) {
    isValid = false;
    errorMessages.push('At least one location is required');
  } else {
    // Check each location's validity
    locationControls.forEach((locationGroup, index) => {
      // Required fields for each location
      const requiredFields = [
        'practice_name',
        'location_name',
        'practiceAdressLine_1',
        'practice_city',
        'practice_state',
        'practice_postal_zip_code',
        'practice_country',
        'practice_timezone',
        'practice_office_phone',
        'practice_email',
        'practice_management_software'
      ];
      
      requiredFields.forEach(field => {
        if (!locationGroup.get(field)?.value) {
          isValid = false;
          errorMessages.push(`Location ${index + 1}: ${this.getFieldLabel(field)} is required`);
          locationGroup.get(field)?.markAsTouched();
        }
      });
      
      // Validate email format
      const emailControl = locationGroup.get('practice_email');
      if (emailControl?.value && !this.isValidEmail(emailControl.value)) {
        isValid = false;
        errorMessages.push(`Location ${index + 1}: Email format is invalid`);
        emailControl.setErrors({'email': true});
      }
      
      // Validate phone number format
      const phoneControl = locationGroup.get('practice_office_phone');
      if (phoneControl?.value && !this.isValidPhoneNumber(phoneControl.value)) {
        isValid = false;
        errorMessages.push(`Location ${index + 1}: Phone number format is invalid`);
        phoneControl.setErrors({'phone': true});
      }
    });
  }
  return isValid;
}

// Helper methods for validation
getFieldLabel(fieldName: string): string {
  const fieldLabels: {[key: string]: string} = {
    'practice_name': 'Practice Name',
    'location_name': 'Location Name',
    'practiceAdressLine_1': 'Address Line 1',
    'practice_city': 'City',
    'practice_state': 'State',
    'practice_postal_zip_code': 'Zip Code',
    'practice_country': 'Country',
    'practice_timezone': 'Timezone',
    'practice_office_phone': 'Office Phone',
    'practice_email': 'Email',
    'practice_management_software': 'Practice Management Software'
  };
  return fieldLabels[fieldName] || fieldName;
}

getShippingFieldLabel(fieldName: string): string {
  const fieldLabels: {[key: string]: string} = {
    'address_line_1': 'Address Line 1',
    'city': 'City',
    'state': 'State',
    'postalCode': 'Zip Code',
    'country': 'Country'
  };
  return fieldLabels[fieldName] || fieldName;
}

isValidEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

isValidPhoneNumber(phone: string): boolean {
  // This pattern should match the format produced by your phone formatter directive
  // Adjust as needed based on your specific formatting requirements
  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phonePattern.test(phone);
}

validateAditCoreSelections(): boolean {
  // Check if each location has at least one add-on selected
  return this.iconStates.every((state, index) => {
    return state.phoneActive || state.analyticActive || state.verificationActive;
  });
}

// Helper methods to determine current step
checkPackageStep(): boolean {
  // Logic to determine if we're on the package selection step
  // You might have a step variable or check DOM elements
  return !this.hideAllcards && this.whichPackageToShow !== '';
}

checkHardwareStep(): boolean {
  // Logic to determine if we're on the hardware step
  return !this.hideAllcards && this.showTable;
}

      
  onSubmit() {
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
    };

    // Add activation fee 
    if (this.activation_fee) {
      formData.activation_fee = Number(this.activation_fee);
    }

    // Add subscription fee based on annual/monthly selection and multiple location logic
    if (this.multiple_location === 'yes') {
      // For multiple locations, calculate total subscription fee
      if (this.isAnnually) {
        formData.subscription_fee = this.getSubscriptionsTotal() || 0;
      } else {
        formData.subscription_fee = this.getSubscriptionsTotalMonthly() || 0;
      }
    }

    // Add hardware total
      formData.hardware_total = this.calculateTotalHardwarePriceTotal() || 0;
    

  
      // For multiple locations, create hardware inventory using the new API format
      // formData.hardware_inventory = {};
      let inventoryArray:any[]=[]
      this.locations.controls.forEach((locationControl, index) => {
        const locationName = locationControl.get('location_name')?.value || `Location ${index + 1}`;
        inventoryArray.push(this.getLocationHardwarePayload(index)) ;
      });
      formData.hardware_inventory=inventoryArray
    

    // Process practice data
    if (this.practiceData.valid) {
      const practiceData = this.practiceData.value;
      
      // If multiple locations, add selectedPackageName to each location's data
      if (this.multiple_location === 'yes') {
        let arr = practiceData.locations;
        if (Array.isArray(arr)) {
          arr.forEach((location, index) => {
            // Check if the selected package is any ADitCore package
          let selected_pacakge=''
         if(this.ifPackageisAditCore){
          selected_pacakge='Adit Core'
          location.selectedPackageName =  selected_pacakge
         }else{
          selected_pacakge=this.selectedPackage[index]
         
         }
            formData.selectedPackageName=this.selectedPackage
            // if (selected_pacakge) {
            //   // For ADitCore packages, use the package name directly
            //   location.selectedPackageName =  this.selectedPackageName;
            // } else {
            //   // For non-ADitCore packages, keep the current logic
            //   location.selectedPackageName = this.selectedPackage[index] || this.selectedPackageName;
            // }
          });
        }
      }
      
      formData.practice_data = practiceData;
    }

    // Add organization data to submit
    if (this.organization_name) {
      formData.organization_name = this.organization_name;
    }

    if (this.organization_poc_name) {
      formData.organization_poc_name = this.organization_poc_name;
    }

    if (this.organization_poc_email) {
      formData.organization_poc_email = this.organization_poc_email;
    }

    if (this.organization_poc_work_number) {
      formData.organization_poc_work_number = this.organization_poc_work_number;
    }

    if (this.organization_poc_cell_number) {
      formData.organization_poc_cell_number = this.organization_poc_cell_number;
    }

    // Add shipping address data based on multiple location setting
    if (this.multiple_location === 'yes') {
      // Set the flag indicators for each location
      formData.shipping_address_is_same_or_not = this.sameAddressForMultipleLocation;

      // Create array to hold shipping addresses for locations with custom addresses
      formData.shipping_addresses = [];

      // Initialize priceAddons object for multiple locations
      formData.priceAddons = {};

      // Process each location
      this.locations.controls.forEach((locationControl, index) => {
        const locationName = locationControl.get('location_name')?.value || `Location ${index + 1}`;

        // Add priceAddons for each location
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

        // Only include shipping address if it's not using the practice address
        if (this.sameAddressForMultipleLocation && !this.sameAddressForMultipleLocation[index]) {
          // Check if shippingAddress exists and has the right index
          const shippingArray = this.shippingAddressForm?.get('shippingAddress') as FormArray;

          if (shippingArray && index < shippingArray.length) {
            const shippingForm = shippingArray.at(index);

            if (shippingForm) {
              formData.shipping_addresses = formData.shipping_addresses || [];
              formData.shipping_addresses.push({
                locationIndex: index,
                locationName: locationName,
                address_line_1: shippingForm.get('address_line_1')?.value,
                address_line_2: shippingForm.get('address_line_2')?.value,
                city: shippingForm.get('city')?.value,
                state: shippingForm.get('state')?.value,
                postalCode: shippingForm.get('postalCode')?.value,
                country: shippingForm.get('country')?.value,
              });
            }
          }
        }
      });
    }

    // Handle signature
    if (this.signature_url) {
      formData.signature_url = this.signature_url;
    } else if (this.signaturePad) {
      if (!this.signaturePad.isEmpty()) {
        formData.signature_url = this.signaturePad.toDataURL(); // Get base64 image
      }
    } else {
      console.warn('No signature to save!');
    }

    if (this.signature_name) {
      formData.signatory_name = this.signature_name;
    }

    this.agreementService
      .add_practice_data(formData, this.agreementId)
      .subscribe({
        next: (res) => {
      
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  showTable: boolean = true;
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
          
                const img = new Image();
                img.src = this.signature_url;
                this.signatureExists=true
              
          this.signaturePad.fromDataURL(this.signature_url);
        }
      } else {
        console.warn(
          'Signature canvas element is not available. It might be conditionally hidden in the template.'
        );
      }
    },100);
   
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

  prices_for_phone: number[] = [150, 100, 100, 10, 10, 275]; // Prices for each hardware item
  prices_for_terminal: number[] = [250, 49]; // Prices for each hardware item
  totalPrice_for_phone: number = 0;
  totalPrice_for_terminal: number = 0;

  calculateTotalPrice(): void {
    if (this.selectPhone == true) {
      this.totalPrice_for_phone = this.counts_for_phone.reduce(
        (sum, count, index) => sum + count * this.prices_for_phone[index],
        0
      );
    }
    if (this.selectTerminal == true) {
      this.totalPrice_for_terminal = this.counts_for_terminal.reduce(
        (sum, count, index) => sum + count * this.prices_for_terminal[index],
        0
      );
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
  multiple_location_yes_totalTechAnnually: any;
  multiple_location_yes_totalTechMonthly: any;
  //analytic
  multiple_location_yes_totalanalyticAnnually: any;
  multiple_location_yes_analyticMonthly: any;
  //aditLite
  multiple_location_yes_totalAditLiteAnnually: any;
  multiple_location_yes_totalAditLiteMonthly: any;

  onTotalTechAnnual(price: any) {
    this.multiple_location_yes_totalTechAnnually = price;
  }
  ontotaltechMonthly(price: any) {
    this.multiple_location_yes_totalTechMonthly = price;
  }
  ontotalanalyticAnnually(price: any) {
    this.multiple_location_yes_totalanalyticAnnually = price;
  }
  ontotalanalyticMonthly(price: any) {
    this.multiple_location_yes_analyticMonthly = price;
  }

  ontotalAditLiteMonthly(price: any) {
    this.multiple_location_yes_totalAditLiteMonthly = price;
  }
  ontotalAditLiteAnnually(price: any) {
    this.multiple_location_yes_totalAditLiteAnnually = price;
  }

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
  totalHardwarePrice: any = 0;
  hardwarePrices: number[] = [150, 100, 100, 10, 10, 275, 250, 49];
  // Initialize an array to store extra hardware prices for each row
  // extraharwarePrices: number[] = [];
  counts: number[] = [2, 0, 0, 0, 0, 0]; // Default count for GRP 2616 is set to 2

  // Update the total hardware purchase price for a specific row
  updateHardwarePurchasePrice(): void {
        this.hardwarepurchasePrices = this.hardware_counts.map((row) =>
            row.reduce((total, hardware) => total + (hardware.count *hardware.price), 0)
          );
         this.calculateTotalHardwarePriceTotalForTable()
          // console.log(this.hardwarepurchasePrices,"this is the price of hardware");
  }

  increment_forMultiple(i: number, j: number): void {
  // Ensure hardware_counts[i] exists
  if (!this.hardware_counts[i]) {
    this.hardware_counts[i] = [];
  }
  // Ensure hardware_counts[i][j] exists
  if (!this.hardware_counts[i][j]) {
    this.hardware_counts[i][j] = { count: 0, price: this.hardwarePrices[j] || 0 };
  }
  this.hardware_counts[i][j].count++;
  this.updateHardwarePurchasePrice();

}
decrement_forMultiple(i: number, j: number): void {
  if (!this.hardware_counts[i]) {
    this.hardware_counts[i] = [];
  }
  if (!this.hardware_counts[i][j]) {
    this.hardware_counts[i][j] = { count: 0, price: this.hardwarePrices[j] || 0 };
  }
  if (this.hardware_counts[i][j].count > 0) {
    this.hardware_counts[i][j].count--;
  }
  this.updateHardwarePurchasePrice();

}


  // Get the price of a specific hardware item
  getHardwarePrice(hardwareIndex: number): number {
    return this.hardwareService.getHardwarePrice(hardwareIndex);
  }

  calculateTotalHardwareCredit(): number {
    let totalCredit = 0;
    
    // Loop through each location and sum up their individual hardware credits
    for (let i = 0; i < this.hardwarepurchasePrices.length; i++) {
      // Use the existing getHardwareCreditDisplay method to calculate credit for each location
      const locationCredit = this.getHardwareCreditDisplay(i);
      totalCredit += locationCredit;
    }
    
    return totalCredit;
  }
    calculateTotalHardwarePriceTotalForTable() {
    // let totalHardwarePrice = 0;
    this.totalHardwarePrice = 0;
    for (let i = 0;i <this.hardwarepurchasePrices.length;i++) {
      // Get hardwarepurchasePrice for this index (use 0 if undefined)
      const purchasePrice = this.hardwarepurchasePrices[i] || 0;
      // console.log('this.selectedHardwareValueExtendesThanCredit',this.selectedHardwareValueExtendesThanCredit);
      let remainingAmount = 0;
       remainingAmount = Math.max(0, purchasePrice -Number(this.getHardwareCreditDisplayInTable()));
      this.totalHardwarePrice += remainingAmount;
    }

    
  }
  calculateHardwareDiscount(i:any){
    this.hardwareCreditDisplayValues[i]=this.getHardwareCreditDisplay(i)
    // console.log('this.hardwareCreditDisplayValues',this.hardwareCreditDisplayValues);
    return this.getHardwareCreditDisplay(i)
  }
  calculateTotalHardwarePriceTotal(): number {
    let totalHardwarePrice = 0;
    for (let i = 0;i <this.hardwarepurchasePrices.length;i++) {
      // Get hardwarepurchasePrice for this index (use 0 if undefined)
      const purchasePrice = this.hardwarepurchasePrices[i] || 0;
      totalHardwarePrice += Number(purchasePrice); ;
    }

    return totalHardwarePrice;
  }
  getSubscriptionsTotal() {
    if (this.multiple_location == 'yes') {
      return (
        this.subscriptionPlans.reduce(
          (total, plan) => total + plan.annually,
          0
        ) * 12
      );
    } else {
      return 0;
    }
  }

  getSubscriptionsTotalMonthly() {
    if (this.multiple_location === 'yes') {
      return this.subscriptionPlans.reduce(
        (total, plan) => total + plan.monthly,
        0
      );
    } else {
      return 0;
    }
  }

  getTotal() {
    let total = 0;

    if (this.multiple_location === 'yes') {
      if (this.isAnnually) {
        total =
          this.getSubscriptionsTotal() + parseInt(this.activation_fee, 10);
      } else {
        total = parseInt(this.activation_fee, 10);
      }

      let hardwareTotal = this.calculateTotalHardwarePriceTotal();
      if (hardwareTotal > 0) {
        total += hardwareTotal;

        // Subtract hardware credit only if purchasePhones or purchaseTerminals is true
        const hardwareCredit = this.isAnnually
          ? this.hardwareCreditAnnually
          : this.hardwareCreditMonthly;
        if (hardwareCredit) {
          const applicableCredit = Math.min(hardwareTotal, hardwareCredit); // Ensure credit does not exceed hardwareTotal
          total -= applicableCredit;
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
            price: this.getHardwarePrice(index), // Calculate price for the first hardware item
          }))
      );

    this.hardwarepurchasePrices = this.hardware_counts.map((row) =>
      row.reduce((total, hardware) => total + hardware.price, 0)
    );
    // Initialize extraharwarePrices with at least one default value
    // this.extraharwarePrices = Array(defaultRowCount).fill(0);
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

    if (event == false) {
      this.allActivePhone = false;
      // Set all phoneActive states to false
      this.iconStates.forEach((rowState) => {
        rowState.phoneActive = false;
      });
      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.phoneAddOnPricesByLocation[i] = false;
        }
      }
    } else {
      this.allActivePhone = true;
      // Set all phoneActive states to false
      this.iconStates.forEach((rowState) => {
        rowState.phoneActive = true;
      });
      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.phoneAddOnPricesByLocation[i] = true;
        }
      }
    }
    this.updateAllActiveState();
  }

  onSelectedAnalytics(event: any) {
    this.analyticActive = event;
    // this.addOnAnalytic = event;
    if (event == false) {
      this.allActiveAnalytic = false;
      // Set all analyticActive states to false
      this.iconStates.forEach((rowState) => {
        rowState.analyticActive = false;
      });
      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.analyticsAddOnPricesByLocation[i] = false;
        }
      }
    } else {
      this.allActiveAnalytic = true;
      // Set all analyticActive states to false
      this.iconStates.forEach((rowState) => {
        rowState.analyticActive = true;
      });
      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.analyticsAddOnPricesByLocation[i] = true;
        }
      }
    }
    this.updateAllActiveState();
  }

  onSelectedVerification(event: any) {
    this.verificationActive = event;
    // this.addOnVerification = event;

    if (event == false) {
      this.allActiveVerification = false;
      // Set all verificationActive states to false
      this.iconStates.forEach((rowState) => {
        rowState.verificationActive = false;
      });
      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.verificationAddOnPricesByLocation[i] = false;
        }
      }
    } else {
      this.allActiveVerification = true;
      // Set all verificationActive states to true
      this.iconStates.forEach((rowState) => {
        rowState.verificationActive = true;
      });

      if (this.locations && this.locations.length > 0) {
        for (let i = 0; i < this.locations.length; i++) {
          this.verificationAddOnPricesByLocation[i] = true;
        }
      }
    }
    this.updateAllActiveState();
  }


  goToExpandForm() {
    if (this.addOnPhone == false) {
      // Only check terminal condition, not phone condition
      if (this.selectTerminal === false) {
 
      } else if (this.selectTerminal === true) {
        // Don't check for checkConditionForHardware when selectTerminal is true
 
      } else {
        alert('Accept the conditions, check the checkbox');
      }
    }
    // Special case for "Only Lite - 1st Yr Promo"
    else if (this.whichPackageToShow === 'Only Lite - 1st Yr Promo') {
      // Only check terminal condition, not phone condition
      if (this.selectTerminal === false || this.selectPhone === false || null) {
 
      } else if (this.selectTerminal === true) {
        // Don't check condition for hardware when terminal is selected
 
      } else {
        alert('Accept the conditions, check the checkbox');
      }
    } else {
      // Original logic for other package types
      if (this.selectPhone === false && this.selectTerminal === false) {
 
      } else if (
        this.selectPhone === true &&
        this.checkConditionForHardware === true
      ) {
        // Only check checkConditionForHardware for phones
 
      } else if (this.selectTerminal === true) {
        // Don't check checkConditionForHardware for terminals
 
      } else {
        alert('Accept the conditions, check the checkbox');
      }
    }
    this.onSubmit();
  }

  goNextToReview() {
    // Check if the practiceData form is valid
    if (this.practiceData.valid) {
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

  // Add this method to properly initialize iconStates
  initializeIconStates() {
    // Create an icon state for each location
    this.iconStates = Array(this.locations.length)
      .fill(null)
     .map((_, index) => ({
      phoneActive: true,
      analyticActive: true,
      verificationActive: true,
      phoneSelectionActive: true,
      purchasePhone: this.purchasePhones[index] || true
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

  // Method to get hardware payload for a specific location in the new API format
  // getLocationHardwarePayload(locationIndex: number): any {
  //   const locationControl = this.locations.at(locationIndex);
  //   const locationName = locationControl.get('location_name')?.value || `Location ${locationIndex + 1}`;

  //   // Get hardware counts for this location
  //   const hardwareCounts = this.hardware_counts[locationIndex] || [];
    
  //   // Get subscription plan for this location
  //   const subscriptionPlan = this.subscriptionPlans[locationIndex] || { annually: 0, monthly: 0 };

  //   return {
  //     locationName: locationName,
  //     activation_fee: String(this.activation_fee ?? ''),
  //     subscription_fee: String(this.isAnnually ? subscriptionPlan.annually*12 : subscriptionPlan.monthly),
  //     adit_voice_hardware: this.purchasePhones[locationIndex] ? 'Yes' : 'No',
  //     adit_pay_hardware: this.purchaseTerminals[locationIndex] ? 'Yes' : 'No',
  //     billing_type: this.isAnnually ? 'Annually' : 'Monthly',
  //     package_type: this.returnPackageName(this.selectedPackage[locationIndex]) || '',
  //     grandstream_grp2616_qty: hardwareCounts[0]?.count || 0,
  //     grandstream_grp2613_qty: hardwareCounts[1]?.count || 0,
  //     grandstream_dp720_qty: hardwareCounts[2]?.count || 0,
  //     grp_2616_wall_mount_qty: hardwareCounts[3]?.count || 0,
  //     grp_2613_wall_mount_qty: hardwareCounts[4]?.count || 0,
  //     headset_adapter_qty: hardwareCounts[5]?.count || 0,
  //     granstrem_dp_720_type: this.hardwarePrices[2] || 0.0,
  //     granstrem_grp_2613_type: this.hardwarePrices[1] || 0.0,
  //     granstrem_grp_2616_type: this.hardwarePrices[0] || 0.0,
  //     granstrem_grp_2616_wall_type: this.hardwarePrices[3] || 0.0,
  //     granstrem_grp_2613_wall_type: this.hardwarePrices[4] || 0.0,
  //     headset_adapter: this.hardwarePrices[5] || 0.0,
  //     bbpos_wispos_qty: hardwareCounts[6]?.count || 0,
  //     bbpos_edock_qty: hardwareCounts[7]?.count || 0,
  //     bbpos_wisepos: this.hardwarePrices[6] || 0.0,
  //     bbpos_edock: this.hardwarePrices[7] || 0.0,
  //     verification_price: String(this.add_on_verification ?? ''),
  //   };
  // }
getLocationHardwarePayload(locationIndex: number): any {
  const locationControl = this.locations.at(locationIndex);
  const locationName = locationControl.get('location_name')?.value || `Location ${locationIndex + 1}`;

  // Get hardware counts for this location
  const hardwareCounts = this.hardware_counts[locationIndex] || [];

  // Get subscription plan for this location
  const subscriptionPlan = this.subscriptionPlans[locationIndex] || { annually: 0, monthly: 0 };

  // Only send hardware values if any hardware is being purchased for this location
  const sendHardware = this.purchasePhones[locationIndex] || this.purchaseTerminals[locationIndex];

  return {
    locationName: locationName,
    activation_fee: String(this.activation_fee ?? ''),
    subscription_fee: String(this.isAnnually ? subscriptionPlan.annually * 12 : subscriptionPlan.monthly),
    adit_voice_hardware: this.purchasePhones[locationIndex] ? 'Yes' : 'No',
    adit_pay_hardware: this.purchaseTerminals[locationIndex] ? 'Yes' : 'No',
    billing_type: this.isAnnually ? 'Annually' : 'Monthly',
    package_type: this.returnPackageName(this.selectedPackage[locationIndex]) || '',
    grandstream_grp2616_qty: sendHardware ? (hardwareCounts[0]?.count || 0) : 0,
    grandstream_grp2613_qty: sendHardware ? (hardwareCounts[1]?.count || 0) : 0,
    grandstream_dp720_qty: sendHardware ? (hardwareCounts[2]?.count || 0) : 0,
    grp_2616_wall_mount_qty: sendHardware ? (hardwareCounts[3]?.count || 0) : 0,
    grp_2613_wall_mount_qty: sendHardware ? (hardwareCounts[4]?.count || 0) : 0,
    headset_adapter_qty: sendHardware ? (hardwareCounts[5]?.count || 0) : 0,
    granstrem_dp_720_type: sendHardware ? (this.hardwarePrices[2] || 0.0) : 0.0,
    granstrem_grp_2613_type: sendHardware ? (this.hardwarePrices[1] || 0.0) : 0.0,
    granstrem_grp_2616_type: sendHardware ? (this.hardwarePrices[0] || 0.0) : 0.0,
    granstrem_grp_2616_wall_type: sendHardware ? (this.hardwarePrices[3] || 0.0) : 0.0,
    granstrem_grp_2613_wall_type: sendHardware ? (this.hardwarePrices[4] || 0.0) : 0.0,
    headset_adapter: sendHardware ? (this.hardwarePrices[5] || 0.0) : 0.0,
    bbpos_wispos_qty: sendHardware ? (hardwareCounts[6]?.count || 0) : 0,
    bbpos_edock_qty: sendHardware ? (hardwareCounts[7]?.count || 0) : 0,
    bbpos_wisepos: sendHardware ? (this.hardwarePrices[6] || 0.0) : 0.0,
    bbpos_edock: sendHardware ? (this.hardwarePrices[7] || 0.0) : 0.0,
    verification_price: String(this.add_on_verification ?? ''),
  };
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
      } else if (!rowState.phoneActive && previousState) {
        // Remove price when turning off
        this.phoneAddOnPricesByLocation[rowIndex] = false;
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
  }

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

    // If multiple locations and we're using subscription plans
    if (this.multiple_location === 'yes' && this.subscriptionPlans.length > 0) {
      return this.subscriptionPlans.reduce(
        (sum, plan) =>
          sum + Number(this.isAnnually ? plan.annually : plan.monthly),
        0
      );
    }
    // Default fallback
    return 0;
  }
  getSubscriptionsTotalForAditLite(): number {
    let length = this.locations.length;
    if(this.isAnnually){
     return this.subscriptionPriceAnnually*12*length;
    }else{
      return this.subscriptionPriceMonthly*length;
    }
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

  getSubscriptionTotalForMultipleLocations(): number {
    let total = 0;
    for (let i = 0; i < this.locations.length; i++) {
      const locationTotal = this.calculateLocationTotal(i);
      total += locationTotal;
    }
    return total;
  }

  getHarwareCreditTotal() {
    const hardwareInventory = this.getLocationHardwareInventory();
    const locationsWithHardware = Object.keys(hardwareInventory).length;
    // Calculate hardware credit based on number of locations with hardware
      let value=0
      for(let i=0;i<locationsWithHardware;i++){
       value += this.calculateHardwareDiscount(i);

      }
    // return totalHardwareCredit;
   
    return value
  }
  hardwareCreditDisplayValues: number[] = [];
  selectedHardwareValueExtendesThanCredit: boolean[] = [];

  getHardwarePriceInTable(index: number): number {
    if (this.hardwarepurchasePrices[index] > this.getHardwareCreditDisplayInTable()) {

      this.selectedHardwareValueExtendesThanCredit[index] = true;
          return this.getMinValue(Number(this.hardwarepurchasePrices[index]),Number(this.getHardwareCreditDisplayInTable())) ||0;
    } else if (this.hardwarepurchasePrices[index] < this.getHardwareCreditDisplayInTable()) {
      this.selectedHardwareValueExtendesThanCredit[index] = false;
          return this.getMinValue(Number(this.hardwarepurchasePrices[index]),Number(this.getHardwareCreditDisplayInTable())) ||0;
    } else {
      this.selectedHardwareValueExtendesThanCredit[index] = true;
          return this.getMinValue(Number(this.hardwarepurchasePrices[index]),Number(this.getHardwareCreditDisplayInTable())) ||0;
    }
  }
  
  getTotaInHardwareTable(index: number): number {
    if(this.selectedHardwareValueExtendesThanCredit[index]){
      // setTimeout(() => {
       return Math.max(0,Number(this.hardwarepurchasePrices[index])-Number(this.getHardwareCreditDisplayInTable()))
      // },100)
    }else{
      return 0
    }
  }
  getHardwareCreditDisplayInTable(): number {
    if (this.isAnnually) {
      return Number(this.hardwareCreditAnnually || 0);
    } else {
      return Number(this.hardwareCreditMonthly || 0);
    }
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
  getTotalPayment() {
    let subscriptionTotal = 0;
    let totalPayment = 0;
    if (this.ifPackageisAditCore) {
      subscriptionTotal = this.getSubscriptionTotalForMultipleLocations();
    }else if(this.ifPackageAditLite){
      subscriptionTotal = this.getSubscriptionsTotalForAditLite()
    } else {
      subscriptionTotal = this.isAnnually
        ? this.getSubscriptionsTotal()
        : this.getSubscriptionsTotalMonthly();
    }
    for(let i = 0; i < this.hardwarepurchasePrices.length; i++) {
      totalPayment+=this.hardwarepurchasePrices[i]-this.getHardwareCreditDisplay(i)
      // totalPayment-=
    }
    if(this.isAnnually){
      totalPayment+=this.totalActivationFee()+subscriptionTotal
    }else{
      totalPayment+=this.totalActivationFee()
    }
    return totalPayment
 
  }

  sameAddressForMultipleLocation: boolean[] = [];
  showSameAddressPracticeForMultipleLocation(index: number) {
    // Toggle the same address state for the specific location
    this.sameAddressForMultipleLocation[index] =
      !this.sameAddressForMultipleLocation[index];
  }

  //accept condtions after signature
  acceptTermsAndConditions: boolean = false;
  acceptEHRConditions: boolean = false;
  bothTermsAccepted: boolean = false;
  updateTermsStatus(): void {
    if (this.acceptTermsAndConditions && this.acceptEHRConditions) {
      this.bothTermsAccepted = true;
    } else {
      this.bothTermsAccepted = false;
    }
  }

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
    this.hideAllcards = true;
    this.expandPayment = true;
  }

  readonly dialog = inject(MatDialog);
  openDialog() {
    let dialog = this.dialog.open(CardDetailsComponent, {
      maxWidth: '80vw',
      minWidth: '400px',
    });

    dialog.afterClosed().subscribe((result) => {

    });
  }
  editAllForm(){
    this.expandPayment = false;
    this.hideAllcards = false;
  }
  returnPackageName(packageName:string) {
 if(packageName === 'Adit Core') {
      return 'Adit Core';
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
getTotalDueToday(index: number): number {
  const plan = this.subscriptionPlans[index];
  const annually = plan?.annually ?? 0;
  const monthly = plan?.monthly ?? 0;
  const activationFee = Number(this.activation_fee) || 0;
  const hardwarePrice = Number(this.hardwarepurchasePrices[index]) || 0;
  const hardwareCredit = Number(this.getHardwareCreditDisplayInTable()) || 0;

  if (this.isAnnually) {
    return activationFee + (annually * 12) + Math.max(0, hardwarePrice - hardwareCredit);
  } else {
    return Math.max(0, hardwarePrice - hardwareCredit) + activationFee;
  }
}

totalActivationFee(){
  let locationCount=this.locations.length;
  return this.activation_fee*locationCount
}

// get hasAnyHardware(): boolean {
//   return this.hardware_counts.some(row => row.some(item => item.count > 0));
// }
get hasAnyPurchasedHardware(): boolean {
  return this.purchasePhones.some(Boolean) || this.purchaseTerminals.some(Boolean);
}
}