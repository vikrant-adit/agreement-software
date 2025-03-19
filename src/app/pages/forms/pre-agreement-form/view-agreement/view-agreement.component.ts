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
import { ActivatedRoute,Router } from '@angular/router';
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
import { ChoosePackagesComponent } from "./choose-packages/choose-packages.component";
@Component({
  selector: 'app-view-agreement',
  standalone: true,
  imports: [
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
    ChoosePackagesComponent
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
  private router = inject(Router)
  agreementId!: string;
  totalCost: any = 0;
  isAnnually: boolean = true;
  selectPhone: boolean = false;
  selectTerminal: boolean = false;
  private agreementService = inject(OnlineFormAgreementService);
  multiple_location: string = 'no'; // Toggle for multiple locations
  practiceData!: FormGroup;

  organization_name: any;
  organization_poc_name: any;
  organization_poc_email: any;
  organization_poc_work_number: any;
  organization_poc_cell_number: any;
  signature_name: any;

  techBundle_strike_price: any = 549;
  techBundle_price_annual: any = 399;
  techBundle_price_monthly: any = 349;

  analyticsBundle_strike_price: any = 649;
  analyticsBundle_price_annual: any = 499;
  analyticsBundle_price_monthly: any = 449;

  constructor(private fb: FormBuilder) {
    this.practiceData = this.fb.group({
      locations: this.fb.array([this.createLocationGroup()]), // Initialize with one location
    });
  }
  expand:boolean=true
  activation_fee:any;
  ngOnInit(): void {
    this.agreementId = this.activeRoute.snapshot.params['agreementId'];
    this.agreementService.getAgreement(this.agreementId).subscribe((res) => {
      this.totalCost = res.tech_stack_total_price;
      this.multiple_location = res.multipleLocations;
      this.activation_fee=res.activation_fee
      console.log(res);
      const featuresArray = JSON.parse(res.features);
      this.updateArrayWithFeatures(this.communicationsList, featuresArray);

      this.updateArrayWithFeatures(this.analytics, featuresArray);
    
      this.updateArrayWithFeatures(this.mobile, featuresArray);
      this.updateArrayWithFeatures(this.operations, featuresArray);
      // this.updateArrayWithFeatures(this.verifications, featuresArray);
    });
  }
  updateArrayWithFeatures(array: { text: string; value: boolean }[], featuresArray: string[]) {
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
    }
  }

  // Method to remove a location form group
  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }


  onSubmit(): void {
    if (this.practiceData.valid) {
      console.log('Form Data:', this.practiceData.value);
      this.saveSignature()
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

  editForm(){
     this.router.navigate(['/pre-agreement-form',this.agreementId])
  }
  saveForm(){
    this.router.navigate(['/dashboard',])
 }
}
