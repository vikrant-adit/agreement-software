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

import { ChoosePackagesComponent } from './choose-packages/choose-packages.component';
import Swal from 'sweetalert2';
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
  private agreementService = inject(OnlineFormAgreementService);
  multiple_location: string = 'no'; // Toggle for multiple locations
  practiceData!: FormGroup;
  expandHardware: any;
  organization_name: any;
  organization_poc_name: any;
  organization_poc_email: any;
  organization_poc_work_number: any;
  organization_poc_cell_number: any;
  signature_name: any;

  totalAnnually: any;
  totalMonthly: any;
  packageToBeShown: boolean = false;
  // nextToHardware:boolean=false
  constructor(private fb: FormBuilder) {
    this.practiceData = this.fb.group({
      locations: this.fb.array([this.createLocationGroup()]), // Initialize with one location
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
  hardwareCreditAnnually:any
  hardwareCreditMonthly:any
  pricingArray: any;

  onNextClick(next: any) {
    console.log('Total Annually:', next);
    this.expandHardware = next;
  }
  onTotalAnnually(total: any) {
    this.subscriptionPriceAnnually = this.totalAnnually = total;
    console.log(total);
  }
  onAnnuallyorMonthlly(isAnnual: any) {
    this.isAnnually = isAnnual;
    // console.log('Total Annually:', this.totalAnnually);
  }
  // Method to handle totalMonthly event
  onTotalMonthly(total: any) {
    this.subscriptionPriceMonthly = this.totalMonthly = total;
  }
  getTotal() {
    let total =
      this.subscriptionPriceAnnually * 12 + parseInt(this.activation_fee);
    // debugger
    return total;
  }
  ngOnInit(): void {
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
        'hardwareCreditMonthly'
      ];

      // Create an array of objects containing only the specified key-value pairs
      this.pricingArray = includedKeys.reduce((acc, key) => {
        if (res.hasOwnProperty(key)) {
          acc[key] = res[key]; // Add the key-value pair to the object
        }
        return acc;
      }, {} as { [key: string]: any }); // Initialize as an empty object
      this.multiple_location = res.multipleLocations;
      const defaultRowCount = this.locations?.controls?.length || 1; // Use 1 if no locations are added
      this.hardware_counts = Array(defaultRowCount)
      .fill(null)
      .map(() =>
        Array(this.hardwarePrices.length).fill(null).map((_, index) => ({
          count: index === 0 ? 2 : 0, // Set count to 2 for the first hardware item
          price: index === 0 ? 2 * this.getHardwarePrice(index) : 0, // Calculate price for the first hardware item
        }))
      );

    // Initialize hardwarepurchasePrices with default values
    this.hardwarepurchasePrices = this.hardware_counts.map((row) =>
      row.reduce((total, hardware) => total + hardware.price, 0)
    );
      // Initialize extraharwarePrices with at least one default value
      this.extraharwarePrices = Array(defaultRowCount).fill(0);
  
      // console.log(this.pricingArray, 'EARRRRRRRRRRRRRR');
      this.analyticAnnual = res.analyticAnnual;
      this.techMonthly_Disc = res.techMonthly_Disc;
      this.analyticAnnual_Disc = res.analyticAnnual_Disc;
      this.techAnnual = res.techAnnual;
      this.techMonthly = res.techMonthly;
      this.techAnnual_Disc = res.techAnnual_Disc;
      this.analyticMonthly = res.analyticMonthly;
      this.analyticMonthly_Disc = res.analyticMonthly_Disc;

      this.aditLiteMontly = res.aditLiteMontly;
      this.aditLiteMontly_Disc = res.aditLiteMontly_Disc;
      this.aditLiteAnnual = res.aditLiteAnnual;
      this.aditLiteAnnual_Disc = res.aditLiteAnnual_Disc;

      this.aditCore_monthly = res.aditCore_monthly;
      this.aditCore_annually = res.aditCore_annually;
      this.add_on_phones = res.add_on_phones;
      this.add_on_analytic = res.add_on_analytic;
      this.add_on_verification = res.add_on_verification;
      this.pozative_Only_Monthly = res.pozative_Only_Monthly;
      this.pozative_Only_Annually = res.pozative_Only_Annually;
      this.verifications_Only_Monthly = res.verifications_Only_Monthly;
      this.verifications_Only_Annually = res.verifications_Only_Annually;
      this.hardwareCreditAnnually=res.hardwareCreditAnnually
      this.hardwareCreditMonthly=res.hardwareCreditMonthly
      if (res.displayTechStackComparison == 0) {
        this.showtechStackGap = false;
      } else {
        this.showtechStackGap = true;
      }
      this.totalCost = res.techStack.tech_stack_totalprice;
      this.activation_fee = res.activation_fee;
      this.whichPackageToShow = res.sales_person_promotion_type;
      const featuresArray = res.techStack.features;

      this.updateArrayWithFeatures(this.communicationsList, featuresArray);

      this.updateArrayWithFeatures(this.analytics, featuresArray);

      this.updateArrayWithFeatures(this.mobile, featuresArray);
      this.updateArrayWithFeatures(this.operations, featuresArray);
      // this.updateArrayWithFeatures(this.verifications, featuresArray);
    });
  }
  updateArrayWithFeatures(
    array: { text: string; value: boolean }[],
    featuresArray: string[]
  ) {
    featuresArray.forEach((feature) => {
      const matchingItem = array.find((item) => item.text === feature);
      if (matchingItem) {
        matchingItem.value = false;
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
      parcticeName: ['', Validators.required],
      locationName: ['', Validators.required],
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
      pracitce_poc_cell_number: ['', Validators.required],
    });
  }

  // Method to add a new location form group
  addLocation(): void {
    if (this.multiple_location) {
      this.locations.push(this.createLocationGroup());
      if(this.multiple_location=='yes'){
        this.purchasePhones = this.locations.controls.map(() => true); // Default to true for all rows
        this.purchaseTerminals = this.locations.controls.map(() => true); // Default to true for all rows
        this.hardware_counts = this.locations.controls.map(() =>
          Array(8).fill(null).map(() => ({ count: 0, price: 0 }))
        );
        this.hardwarepurchasePrices = this.locations.controls.map(() => 0);
      }
    }
  }

  // Method to remove a location form group
  removeLocation(index: number): void {
    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "", "success");
        this.locations.removeAt(index);
      } 
    });
    //
  }

  onSubmit(): void {
    if (this.practiceData.valid) {
      console.log('Form Data:', this.practiceData.value);
      this.saveSignature();
      let formData = {
        organization_name: this.organization_name,
        organization_poc_name: this.organization_poc_name,
        organization_poc_email: this.organization_poc_email,
        organization_poc_work_number: this.organization_poc_work_number,
        organization_poc_cell_number: this.organization_poc_cell_number,
        signature_url: this.signaturePad.toDataURL(),
        signatory_name: this.signature_name,
        practice_data: this.practiceData.value,
      };
      this.agreementService
        .add_practice_data(formData, this.agreementId)
        .subscribe((res) => {
          console.log(res);
        });
    } else {
      console.log('Form is invalid');
    }
  }


  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      backgroundColor: 'white',
      penColor: 'black',
    });

    // Resize canvas to fit parent
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.signaturePad.clear(); // Clear pad after resizing
  }

  clearPad() {
    this.signaturePad.clear();
  }

  saveSignature() {
    if (!this.signaturePad.isEmpty()) {
      const dataUrl = this.signaturePad.toDataURL(); // Get base64 image
      console.log('Saved Signature:', dataUrl);
    } else {
      console.warn('No signature to save!');
    }
  }

  counts: number[] = [0, 0, 0, 0, 0, 0, 0, 0]; // Initialize counts for each item

  increment(index: number) {
    this.counts[index]++;
  }

  decrement(index: number) {
    if (this.counts[index] > 0) {
      this.counts[index]--;
    }
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
  multiple_location_yes_totalTechAnnually:any
  multiple_location_yes_totalTechMonthly:any
  multiple_location_yes_totalanalyticAnnually:any
  multiple_location_yes_analyticMonthly:any

  onTotalTechAnnual(price:any){
    console.log(price);
    this.multiple_location_yes_totalTechAnnually=price;
  }
  ontotaltechMonthly(price:any){
    console.log(price);
    this.multiple_location_yes_totalTechMonthly=price;
  }
  ontotalanalyticAnnually(price:any){
    console.log(price);
    this.multiple_location_yes_totalanalyticAnnually=price;
  }
  ontotalanalyticMonthly(price:any){
    console.log(price);
    this.multiple_location_yes_analyticMonthly=price;
  }
  // hande subscription plan when select multiple location

  subscriptionPlan_annually:any
  subscriptionPlan_monthly:any

  //table package change events
  choosedPackagesContent: string = '';

// Initialize an array to store subscription prices for each location
subscriptionPlans: { annually: number; monthly: number }[] = [];

// Update the subscription plan when the package changes
onPackageChange(event: any, index: number) {
  const selectedPackage = event.target.value;

  if (selectedPackage === 'tech') {
    this.subscriptionPlans[index] = {
      annually: this.multiple_location_yes_totalTechAnnually || 0,
      monthly: this.multiple_location_yes_totalTechMonthly || 0,
    };
  } else if (selectedPackage === 'analytic') {
    this.subscriptionPlans[index] = {
      annually: this.multiple_location_yes_totalanalyticAnnually || 0,
      monthly: this.multiple_location_yes_analyticMonthly || 0,
    };
  } else {
    this.subscriptionPlans[index] = { annually: 0, monthly: 0 }; // Default values
  }
}

//handling for multiple location hardware contents
purchasePhones: boolean[] = [];
purchaseTerminals: boolean[] = [];
purchasePhone=true
hardware_counts: { count: number; price: number }[][] = [];
hardwarepurchasePrices: number[] = [];
hardwarePrices: number[] = [
  150, 100, 100, 10, 10, 275, 250, 49 ];
// Initialize an array to store extra hardware prices for each row
extraharwarePrices: number[] = [];

// Update the total hardware purchase price for a specific row
updateHardwarePurchasePrice(rowIndex: number): void {
  const totalHardwarePrice = this.hardware_counts[rowIndex].reduce(
    (total, hardware) => total + hardware.price,
    0
  );

  // Get the hardware credit based on the billing cycle
  const hardwareCredit = this.isAnnually
    ? this.hardwareCreditAnnually
    : this.hardwareCreditMonthly;

  // If total hardware price exceeds the credit, split the values
  if (totalHardwarePrice > hardwareCredit) {
    this.hardwarepurchasePrices[rowIndex] = hardwareCredit; // Cap at hardware credit
    this.extraharwarePrices[rowIndex] = totalHardwarePrice - hardwareCredit; // Remaining goes to extra
  } else {
    this.hardwarepurchasePrices[rowIndex] = totalHardwarePrice; // Within credit
    this.extraharwarePrices[rowIndex] = 0; // No extra
  }
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

// Update the total hardware purchase price for a specific row
// updateHardwarePurchasePrice(rowIndex: number): void {
//   this.hardwarepurchasePrices[rowIndex] = this.hardware_counts[rowIndex].reduce(
//     (total, hardware) => total + hardware.price,
//     0
//   );
// }

// Get the price of a specific hardware item
getHardwarePrice(hardwareIndex: number): number {
  // const prices = [150, 100, 100, 10, 10, 275, 250, 49]; // Prices for each hardware item
  return this.hardwarePrices[hardwareIndex] || 0;
}
calculateTotalHardwarePrice() {
  return this.extraharwarePrices.reduce((total, price) => total + price, 0);
}
calculateTotalHardwarePriceTotal(): number {
  // Sum up the hardwarepurchasePrices for all rows
  const totalHardwarePurchasePrice = this.hardwarepurchasePrices.reduce((total, price) => total + price, 0);

  // Sum up the extraharwarePrices for all rows
  const totalExtraHardwarePrice = this.extraharwarePrices.reduce((total, price) => total + price, 0);

  // Return the combined total
  return totalHardwarePurchasePrice + totalExtraHardwarePrice;
}
}
