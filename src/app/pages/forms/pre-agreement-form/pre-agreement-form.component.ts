import { Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../header/header.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TechStackComparisonComponent } from './tech-stack-comparison/tech-stack-comparison.component';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { promotionPricing } from './pricingArr';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { EventRepsService } from '../../../../services/system-setting/event-reps.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
@Component({
  selector: 'app-pre-agreement-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    TechStackComparisonComponent,
    ToastrModule
  ],
  templateUrl: './pre-agreement-form.component.html',
  styleUrl: './pre-agreement-form.component.scss',
  providers: provideNativeDateAdapter(),
})
export class PreAgreementFormComponent implements OnInit {
  preAgreementForm: FormGroup;
  dental_or_optometry = '';
  formService=inject(OnlineFormAgreementService);
  receivedForm!: FormGroup;
  private eventService = inject(EventRepsService)
  private activeRouter =inject(ActivatedRoute)
  onFormChanged(form: FormGroup) {
    this.receivedForm = form;
    // console.log('Received Form:', this.receivedForm.value);
  }
  constructor(private fb: FormBuilder, private router:Router,private toastr:ToastrService) {
    this.preAgreementForm = this.fb.group({
      practiceIndustry: ['', Validators.required],
      newOrExistingClient: ['', Validators.required],
      multipleLocations: ['', Validators.required],
      accountId: ['', [Validators.required, Validators.pattern(/^\d{19}$/)]],
      currency: ['', Validators.required],
      pms: ['', Validators.required],
      displayPricing: [false],
      displayTechStackComparison: [false],
      sales_person_promotion_type: [''],
      promotionExpiryDate:[],
      event_type: [''],
      pricingDetails: this.createPricingFormGroup(), // Nested FormGroup
      techStack:[[]]
    });
  }
  createPricingFormGroup(): FormGroup {
    return this.fb.group({});
  }
  agreementId:any;
  ngOnInit(): void {
    let id =  this.activeRouter.snapshot.params['id']
    if(id){
      this.agreementId=id
      this.formService.getAgreement(this.agreementId).subscribe(res=>{
        console.log(res)
        this.preAgreementForm.patchValue(res)
      })
    }
    // this.onPromotionChange();
    this.preAgreementForm.get('accountId')?.valueChanges.pipe(
        debounceTime(300), // Wait for 300ms after the user stops typing
        distinctUntilChanged(), // Only emit if the value has changed
        filter(value => value.length === 19) // Only proceed if the input is exactly 19 digits
      )
      .subscribe(value => {
        if (this.preAgreementForm.get('accountId')?.valid) {
          this.fetchDeals(value);
        }
      });
  }
  onSubmit() {
    // Set the techStack value from receivedForm
    this.preAgreementForm.get('techStack')?.setValue(this.receivedForm.value);
    console.log("Updated techStack:", this.preAgreementForm.get('techStack')?.value);
  
    // Check if the form is valid
    if (this.preAgreementForm.valid) {
      const formData = new FormData();
  
      // Append non-file form fields
      Object.keys(this.preAgreementForm.value).forEach(key => {
        const value = this.preAgreementForm.value[key];
  
        // Handle nested objects (e.g., pricingDetails)
        if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value)); // Convert object to JSON string
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
  
      // Append file separately if selected
      if (this.selectedFile) {
        formData.append('fileUpload', this.selectedFile, this.selectedFile.name); // Include file name
      }
  
      // Log the FormData for debugging
      console.log("Data that is submitted:", formData);
  
      // Submit the form data to the API
      this.formService.saveForm(formData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully:', response);
          this.router.navigate(['/view-agreement'])
          this.toastr.success('Form submitted successfully!');
          this.preAgreementForm.reset(); // Reset the form
          this.selectedFile = null; // Clear the selected file
          this.router.navigate(['/view-agreement/'+response.agreementId])
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again.');
        }
      });
    } else {
      // If the form is invalid, show an alert
      alert('Please fill all required fields.');
    }
  }
  
  promotionPricing: any = promotionPricing;
  get promotionKeys() {
    return Object.keys(this.promotionPricing);
  }

  loading: boolean = false;
  selectedPromotion: string | null = null;
  eventOptions: any[] = [];

  
  onPromotionChange() {
    const selectedPromo = this.preAgreementForm.get(
      'sales_person_promotion_type'
    )?.value;
    const pricingDetails = this.preAgreementForm.get(
      'pricingDetails'
    ) as FormGroup;
    this.selectedPromotion = selectedPromo; // Capture selected promotion type
    if(this.selectedPromotion === 'Event'){
      this.eventService.getUsers().subscribe(res=>{
       this.eventOptions = res
      })
    }
    if (!this.promotionPricing[selectedPromo]) {
      return;
    }

    this.loading = true; // Show loader

    // Remove existing controls
    Object.keys(pricingDetails.controls).forEach((control) => {
      pricingDetails.removeControl(control);
    });

    this.preAgreementForm.updateValueAndValidity();

    setTimeout(() => {
      const newPricing = this.promotionPricing[selectedPromo];
      const pricingDetails = this.preAgreementForm.get(
        'pricingDetails'
      ) as FormGroup;

      // First, remove existing pricing controls
      Object.keys(pricingDetails.controls).forEach((control) => {
        pricingDetails.removeControl(control);
      });

      // Loop through new pricing object and add controls
      Object.keys(newPricing).forEach((control) => {
        if (!control.endsWith('_Min') && !control.endsWith('_Max')) {
          const minValue = newPricing[`${control}_Min`] ?? null;
          const maxValue = newPricing[`${control}_Max`] ?? null;
          const isEditable = minValue !== null && maxValue !== null;

          pricingDetails.addControl(
            control,
            new FormControl(
              newPricing[control],
              isEditable
                ? [
                    Validators.min(minValue),
                    Validators.max(maxValue),
                  ]
                : []
            )
          );
        }
      });

      // Ensure `activation_fee` is always added
      if (!pricingDetails.get('activation_fee')) {
        pricingDetails.addControl(
          'activation_fee',
          new FormControl(newPricing.activation_fee ?? 0)
        );
      }

      // Update form validity to trigger change detection
      this.preAgreementForm.updateValueAndValidity();
      this.loading = false;
    }, 100);
  }

  getMinValue(control: string): number | null {
    return (
      this.promotionPricing[
        this.preAgreementForm.get('sales_person_promotion_type')?.value
      ]?.[`${control}_Min`] || null
    );
  }

  getMaxValue(control: string): number | null {
    return (
      this.promotionPricing[
        this.preAgreementForm.get('sales_person_promotion_type')?.value
      ]?.[`${control}_Max`] || null
    );
  }

  isFieldDisabled(control: string): boolean {
    return (
      this.getMinValue(control) === null || this.getMaxValue(control) === null
    );
  }
  getFormControl(control: string) {
    return this.preAgreementForm.get('pricingDetails')?.get(control);
  }
  getPricingControls(): string[] {
    return Object.keys(
      this.preAgreementForm.get('pricingDetails')?.value || {}
    );
  }

  getBundleClass(control: string): string {
    if (control.toLowerCase().includes('tech')) {
      return 'techBundle';
    } else if (control.toLowerCase().includes('analytic')) {
      return 'analyticBundle';
    } else if (control.toLowerCase().includes('aditlite')) {
      return 'aditLiteBundle';
    } else {
      return 'defaultBundle'; // Optional: a fallback class
    }
  }

  getLabel(control: string): string {
    if (control.includes('techMonthly_Disc')) {
      return 'Tech Bundle Monthly Discount';
    } else if (control.includes('techMonthly')) {
      return 'Tech Bundle Monthly ';
    } else if (control.includes('techAnnual_Disc')) {
      return 'Tech Bundle Annual Discount';
    } else if (control.includes('techAnnual')) {
      return 'Tech Bundle Annual';
    } else if (control.includes('analyticMonthly_Disc')) {
      return 'Analytic Bundle Monthly Discount';
    } else if (control.includes('analyticMonthly')) {
      return 'Analytic Bundle Monthly ';
    } else if (control.includes('analyticAnnual_Disc')) {
      return 'Analytic Bundle Annual Discount';
    } else if (control.includes('analyticAnnual')) {
      return 'Analytic Bundle Annual';
    } else if (control.includes('aditLiteMontly_Disc')) {
      return 'Adit Lite Monthly Discount';
    } else if (control.includes('aditLiteMontly')) {
      return 'Adit Lite Monthly';
    } else if (control.includes('aditLiteAnnual_Disc')) {
      return 'Adit Lite Annual Discount';
    } else if (control.includes('aditLiteAnnual')) {
      return 'Adit Lite Annual';
    } else {
      return 'Activation Fee'; // Convert camelCase to readable text
    }
  }

  getBundleTitle(control: string): string {
    if (control.toLowerCase().includes('tech')) {
      return 'Tech Bundle';
    } else if (control.toLowerCase().includes('analytic')) {
      return 'Analytic Bundle';
    } else if (control.toLowerCase().includes('aditlite')) {
      return 'Adit Lite Bundle';
    }
    return 'Activation Fee'; // Default title if none match
  }

  shouldShowTitle(control: string, index: number): boolean {
    if (index === 0) {
      return true; // Always show title for the first item
    }

    const prevControl = this.getPricingControls()[index - 1];

    return this.getBundleClass(control) !== this.getBundleClass(prevControl);
  }
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.preAgreementForm.patchValue({ fileUpload: file });
      console.log('Selected file:', file.name);
    }
  }
  
  downloadSampleFile(): void {
    this.formService.downloadSampleFile().subscribe({
        next: (file: Blob) => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(file);
            a.href = objectUrl;
            a.download = 'Muliple-Location-Data-Sample.csv';
            a.click();
            URL.revokeObjectURL(objectUrl); // Clean up
        },
        error: (error) => {
            console.error('Error downloading file:', error);
        },
        complete: () => {
            console.log('File download completed.');
        }
    });
}
deals: any[] = [];
errorMessage: string = '';
successMsg!:string
fetchDeals(accountId: string): void {
  this.formService.fetchDeal(accountId).subscribe({
   next: (response: any) => {
      if (response.deals && response.deals.length > 0) {
        this.deals = response.deals;
       this.successMsg='Account Validated'
      } else {
        this.deals = [];
        this.errorMessage = 'No deals found for the given account ID';
      }
    },
    error: (error) => {
      this.deals = [];
      this.errorMessage = 'An error occurred while fetching deals';
    }
});
}
}
